const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const gcmq = require('gulp-group-css-media-queries');
const babel = require('gulp-babel');
var twig = require('gulp-twig');

function compile() {
	return src([
		'./app/templates/*.twig'
	])
		.pipe(twig({
			errorLogToConsole: true,
			data: {
				title: 'Артем',
				scils: [
					'js',
					'scss',
					'html',
					'png',
				]
			},
			functions: [
				{
					name: "getClassMix",
					func: function (blockClass, elemClass, separator = "__") {
						if (typeof blockClass.trim() === ''
							|| typeof elemClass.trim() === '') {
							return ''
						}

						return Array.from(arguments).join(separator);
					}
				},
				{
					name: "getClassMod",
					func: function (elemClass, modClass, separator = "--") {
						if (typeof elemClass.trim() === ''
							|| typeof modClass.trim() === '') {
							return ''
						}

						return Array.from(arguments).join(separator);
					}
				},
				{
					name: "getCommonStr",
					func: function () {
						return Array.from(arguments).join(' ').trim();
					}, function(elemClass, modClass, separator = "--") {
						if (typeof elemClass.trim() === ''
							|| typeof modClass.trim() === '') {
							return ''
						}

						return Array.from(arguments).join(separator);
					}
				},
				{
					name: "createBemClass",
					func: function (baseClass, objClasses = {}) {
						const { mixs, mods, ...dop } = objClasses;
						let _mixClass = "",
							_modClass = "",
							_dopClass = "";

						if (baseClass) {
							if (mixs) _mixClass = _createMixClass(baseClass, mixs);
							if (mods) _modClass = _createModClass(baseClass, mods);
						}

						if (dop) {
							const keysDop = Object.keys(dop);

							_dopClass = keysDop.map(function (key) {
								if (key !== '_keys') {
									return String(dop[key]).split(/,\s*/).join(' ');
								}
							})

							_dopClass = _dopClass.join(' ');
						}

						function _createModClass(base, branch, separator = "--") {
							let result = [];

							if (typeof branch === 'string') {
								branch = String(branch);
								branch = branch.split(/,\s*/);
							}

							if (branch.length > 0) {
								result = branch.map(function (_class) {
									return `${base}${separator}${_class.trim()}`;
								});
							}

							return result.join(' ');
						}

						function _createMixClass(base, branch, separator = "__") {
							let result = [];

							if (typeof branch === 'string') {
								branch = String(branch);
								branch = branch.split(/,\s*/);
							}

							if (branch.length > 0) {
								result = branch.map(function (_class) {
									return `${_class.trim()}${separator}${base}`;
								});
							}

							return result.join(' ');
						}

						return [_mixClass, baseClass, _modClass, _dopClass].join(' ').trim();
					}
				}
			]
		}))
		.pipe(dest('app/'));
}

function svgSprites() {
	return src('app/assets/img/generatorSvg/unification/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('app/assets/img/generatorSvg'))
}

function images() {
	return src('app/assets/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/assets/img'))
}

function scripts() {
	return src([
		'app/assets/js/lib/**/*.js',
		'app/assets/js/base.js',
		'app/assets/js/utils/*.js',
		'app/assets/js/plugins/*.js',
		'app/assets/js/index.js',
	])
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		//.pipe(uglify())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(dest('app/assets/js'))
		.pipe(browserSync.stream())
}

function scriptsBuild() {
	return src([
		'app/assets/js/index.js'
	])
		.pipe(concat('main.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(dest('dist/assets/js'));
}

function styles() {
	return src('app/assets/style/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(scss())
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write())
		.pipe(dest('app/assets/style/css'))
		.pipe(browserSync.stream());
}

function stylesBuild() {
	return src('app/assets/style/scss/main.scss')
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 version'],
			grid: true
		}))
		.pipe(dest('dist/assets/style/css'));
}

function build() {
	return src([
		'app/assets/style/css/libraries/**/*',
		'app/assets/fonts/**/*',
		'app/assets/js/libraries/**/*',
		'app/*.html'
	], { base: 'app' })
		.pipe(dest('dist'))
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
}

function cleanDist() {
	return del('dist')
}

function watching() {
	watch(['app/assets/style/scss/**/*.scss'], styles);
	watch(['app/templates/**/*.twig'], compile);
	watch(['app/assets/js/**/*.js', '!app/assets/js/main.js'], scripts);
	watch(['app/*.html']).on('change', browserSync.reload);
	watch(['app/assets/img/generatorSvg/unification/*.svg'], svgSprites);
}

exports.compile = compile;
exports.styles = styles;
exports.stylesBuild = stylesBuild;
exports.scriptsBuild = scriptsBuild;
exports.svgSprite = svgSprites;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build, stylesBuild, scriptsBuild);

exports.default = parallel(compile, styles, scripts, svgSprites, browsersync, watching);

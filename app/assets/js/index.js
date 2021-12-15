myApp.breakPoint = {
	desctop: 1920,
	desctopMid: 1450,
	desctopMin: 1230,
	table: 1024,
	mobile: 768,
	tel: 480,
}

myApp.scrollingWindow = _plugins.scrollWindow();

// search
if (_utils.isElem('.search-panel')) {
	myApp.mainSearch = _plugins.searchPanel('.search-panel', {
		toggleEl: document.querySelector('.js-search-toggle'),
	});
}

// horizontal menu
if (_utils.isElem('.menu')) {
	myApp.mainMenus = _plugins.gorizontalMenu('.menu');
}

// main slider
if (_utils.isElem('.main-slider')) {
	myApp.mainSlider = _plugins.slider('.main-slider');
}

// cards slider
if (_utils.isElem('.cards-slider')) {
	const $cardsSliderList = document.querySelectorAll('.cards-slider');
	myApp.cardsSliders = _utils.mapOne($cardsSliderList, function ($slider) {
		_plugins.slider($slider, {
			slideToClickedSlide: true,
			breakpoints: {
				300: {
					slidesPerView: 'auto',
					centeredSlides: true,
				},
				[myApp.breakPoint.mobile]: {
					slidesPerView: 2,
					centeredSlides: true,
				},
				[myApp.breakPoint.table]: {
					slidesPerView: 3,
					centeredSlides: false,
				}
			}
		});
	})
}

// miniatures slider
if (_utils.isElem('.miniatures-slider')) {
	myApp.$miniaturesSliders = document.querySelectorAll('.miniatures-slider');
	_utils.mapOne(myApp.$miniaturesSliders, function ($slider) {
		_plugins.slider($slider, {
			loop: true,
			grabCursor: true,
			slidesPerView: 6,
			spaceBetween: 20,
			breakpoints: {
				[300]: {
					slidesPerView: 'auto',
				},
				[myApp.breakPoint.mobile]: {
					slidesPerView: 6,
				}
			}
		})
	});
}

// v-up кнопка вверх
(function (scrollingWindow) {
	document.querySelector('body').insertAdjacentHTML('afterbegin', `
		<div class="v-up"></div>
	`);

	const btnDown = document.querySelector('.v-up');
	let vUpTriggerTimer = undefined;

	vUp(btnDown, getScroledWindow);

	btnDown.addEventListener('click', function () {
		scrollingWindow.startAmimationScroll(1);
	});

	window.addEventListener('scroll', function () {
		clearTimeout(vUpTriggerTimer);
		vUpTriggerTimer = setTimeout(() => {
			vUp(btnDown, getScroledWindow);
		}, 200)
	});

	//пролистываине окна вверх при клике на кнопку
	function vUp(btn, scroled) {
		if (scroled() > (window.innerHeight / 2)) {
			btn.classList.add('active');
		} else if (scroled() < (window.innerHeight / 2) || btn.classList.contains('active')) {
			btn.classList.remove('active');
		}
	}

	//на сколько прокручено окно
	function getScroledWindow() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
}(myApp.scrollingWindow));

//Hamburger открытия мобильного меню
if (_utils.isElem('.header__hamburger')) {
	(function () {

		const hamburgerClassName = '.header__hamburger';
		const burgerBlockClassName = '.header__burger';
		const burgerInnerClassName = '.header__burger-inner';
		const $body = document.querySelector('body');
		const $header = document.querySelector('header');
		const $hamburger = document.querySelector(hamburgerClassName);
		const $burgerBlock = document.querySelector(burgerBlockClassName);
		const $burgerInner = document.querySelector(burgerInnerClassName);
		const mediaQuery = window.matchMedia(`(max-width: ${myApp.breakPoint.desctopMin}px)`);

		document.addEventListener('click', function (e) {
			if (e.target.closest(hamburgerClassName)) {
				const offsetRight = window.innerWidth - $body.offsetWidth;
				$hamburger.classList.toggle('active');
				$burgerBlock.style.top = $header.offsetHeight + 'px';

				let isActive = $hamburger.classList.contains('active');
				$burgerBlock.classList[isActive ? 'add' : 'remove']('open');
				$burgerInner.style.maxHeight = (isActive) ? `calc(100vh - ${$header.offsetHeight}px)` : '';
				$body.style.overflow = (isActive) ? 'hidden' : '';
			} else if ($burgerBlock.classList.contains('open') && !$burgerInner.contains(e.target)) {
				$hamburger.classList.remove('active');
				$burgerBlock.classList.remove('open');
				$body.style.overflow = '';
			}
		});

		mediaQuery.addListener(function (e) {
			if (!e.matches && $burgerBlock.classList.contains('open')) {
				$hamburger.classList.remove('active');
				$burgerBlock.classList.remove('open');
				$body.style.overflow = '';
				document.documentElement.style.paddingRight = '';
			}
		})

	}(myApp));
}

//slinky header menu
(function (myApp) {
	if (_utils.isElem('header .bro-menu')) {
		const $menu = document.querySelector('header .bro-menu');
		myApp.headerBroMenu = _plugins.broMenu($menu);
		const mediaQuery = window.matchMedia(`(max-width: ${myApp.breakPoint.desctopMin}px)`);

		toggleMenu();

		mediaQuery.addListener(toggleMenu)

		function toggleMenu() {
			if (mediaQuery.matches) {
				myApp.headerBroMenu.init();

			} else {
				myApp.headerBroMenu.destroy();
			}
		}
	}
}(myApp));

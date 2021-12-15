// анимация скрола окна браузера
_plugins.scrollWindow = function () {
	let scrollAnimationId = 0;
	let currentScroll = window.pageYOffset;
	let scrolls = false;

	function startAmimationScroll(newScrollY, callback) {
		if (!scrolls) {
			currentScroll = window.pageYOffset;
			scrolls = true;
		}

		scrollAnimationId++;
		const deltaScroll = (newScrollY - currentScroll);

		currentScroll += deltaScroll * 0.15;
		window.scrollTo(0, currentScroll);

		if (Math.abs(deltaScroll) > 5) {
			scrollAnimationId = window.requestAnimationFrame(function () {
				startAmimationScroll(newScrollY);
			})
		} else {
			window.scrollTo(0, newScrollY);
			stopAnimationScroll();
			scrolls = false;

			if (typeof callback === 'function') callback();
		}
	}

	function stopAnimationScroll() {
		window.cancelAnimationFrame(scrollAnimationId);
		scrollAnimationId = undefined;
		scrolls = false;
	}

	return {
		get scrollAnimationId() {
			return scrollAnimationId;
		},
		startAmimationScroll,
		stopAnimationScroll,
	}
}

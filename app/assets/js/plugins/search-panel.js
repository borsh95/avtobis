_plugins.searchPanel = function (selector, options = {}) {
	const $el = typeof selector === 'string' ? document.querySelector(selector) : selector,
		$input = $el.querySelector('.search-panel__input'),
		$closeBtn = $el.querySelector('.search-panel__close'),
		toggleClass = 'open';
	let opened = false;

	const defaultOptions = {
		toggleEl: null,
	}

	options = Object.assign(defaultOptions, options);

	const methods = {
		toggle() {
			$el.classList.toggle(toggleClass);
			opened = !opened;
			console.log($input);
			if (opened) $input.focus();
		},
		close() {
			if (!opened) return;
			$el.classList.remove(toggleClass);
			opened = false;
		}
	}

	document.addEventListener('click', clickHandler);

	function clickHandler(e) {
		const $target = e.target;
		const $toggleEl = options.toggleEl;

		if ($toggleEl && $toggleEl.contains($target)) {
			methods.toggle();
		} else if (!$el.contains($target) || $closeBtn.contains($target)) {
			methods.close();
		}
	}

	return methods;
}

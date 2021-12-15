_plugins.gorizontalMenu = function (selector, options = {}) {
	const $els = (typeof selector === 'string')
		? Array.from(document.querySelectorAll(selector))
		: [selector],
		baseClass = 'menu',
		submenuClass = baseClass + '__submenu',
		itemClass = baseClass + '__item',
		lvlClass = baseClass + '-lvl',
		itemHangClass = itemClass + "--hang",
		itemHangOpenClass = itemClass + "--open",
		itemHangToggleClass = itemClass + "-toggle";

	const defaultOptions = {};
	options = Object.assign(defaultOptions, options);

	const istances = $els.map(el => plugin(el));
	return istances.length > 1 ? istances : istances[0];

	// plugin function
	function plugin($el, options) {
		let $openItemHang = null;
		const $subMenuList = $el.getElementsByClassName(submenuClass);

		_setLvls($el, 1);

		$el.addEventListener('click', clickHandler);
		document.addEventListener('click', clickHandlerDocument);
		window.addEventListener('resize', resizeHandlerWindow);

		function clickHandler(e) {
			let $target = e.target;

			if ($target.closest(`.${itemHangToggleClass}`)) {
				$target = $target.closest(`.${itemHangToggleClass}`);
				_toggleSubMenu($target, $openItemHang);
			}
		}

		function clickHandlerDocument(e) {
			if (!$el.contains(e.target) && $openItemHang) {

				$openItemHang.classList.remove(itemHangOpenClass);
			}
		}

		function resizeHandlerWindow() {
		}
	}

	/**
	 * Устанавливает макс высоту выпадающих подменю
	 *
	 * @param {Element}
	 * @return {undefined}
	*/
	function _setLvls(menu, initialLvl) {
		const $childrenItems = menu.children;
		menu.classList.add(`${lvlClass}-${initialLvl}`);

		for (const $item of $childrenItems) {
			const $subMenu = $item.querySelector(`.${submenuClass}`);

			if ($subMenu) _setLvls($subMenu, initialLvl + 1);
		}
	}

	function _toggleSubMenu($trigger, $openItemHang) {
		const $parentItem = $trigger.closest(`.${itemHangClass}`);
		$parentItem.classList.toggle(itemHangOpenClass);

		if (!$openItemHang) {
			$openItemHang = $parentItem;
		} else {
			$openItemHang = null;
		}
	}
}

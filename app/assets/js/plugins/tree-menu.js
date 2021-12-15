_plugins.treeMenu = (function treeMenu() {
	let $menus = document.querySelectorAll('.js-tree-menu');

	for (let i = 0; i < $menus.length; i++) {
		setupTreeMenu($menus[i]);
	}

	function setupTreeMenu(selector, options = {}) {
		const $el = (typeof selector === 'string') ? document.querySelector(selector) : selector;
		const openItemClass = 'js-tree-menu__item--open';

		const setings = {
			openItemClass: 'js-tree-menu__item--open',
			openSelector: '.js-tree-menu__btn'
		}

		for (let openItem of document.getElementsByClassName(setings.openItemClass)) {
			const $childrenUl = openItem.querySelector('ul');
			$childrenUl.style.minHeight = $childrenUl.scrollHeight + 'px';
		}

		$el.addEventListener('click', function (e) {
			const $btn = e.target.closest(setings.openSelector);
			if (!$btn) return;

			let $parentElement = $btn.closest('li') || $btn.closest('.js-tree-menu__inner');
			console.log($parentElement);
			let $childrenContainer = $parentElement.querySelector('ul');

			if (!$childrenContainer) return;

			const isOpenItem = $parentElement.classList.contains(setings.openItemClass);

			$parentElement.classList[isOpenItem ? 'remove' : 'add'](setings.openItemClass);
			$childrenContainer.style.minHeight = !isOpenItem ? $childrenContainer.scrollHeight + "px" : "";
		})
	}
}());

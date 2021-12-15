//slinky menu
_plugins.broMenu = function (selector, options) {
	const $menu = typeof selector === "string" ? document.querySelector(selector) : selector;
	const $level_1 = $menu.lastElementChild;
	const $subMenuList = $menu.querySelectorAll('li > ul');
	const $subMenuLink = $menu.querySelectorAll('li > a');
	let activated;

	let defaulOptions = {
		arrow: `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M12.219 2.281L10.78 3.72 18.062 11H2v2h16.063l-7.282 7.281 1.438 1.438 9-9 .687-.719-.687-.719z" />
			</svg>
		`
	}

	Object.assign(defaulOptions, options);

	let $activeUl;
	let translate = 0;

	const method = {
		init() {
			if (activated) return;

			$menu.classList.add('bro-menu');

			for (let submenu of $subMenuList) {
				const link = submenu.parentElement.querySelector('li > a');
				link.classList.add('bro-menu__next');
				submenu.classList.add('bro-menu__submenu');

				_addBtnBack(submenu, link);
				_addBtnNext(link);

				activated = true;
			}

			for (const $link of $subMenuLink) {
				$link.classList.add('active');
			}

			$menu.addEventListener('click', clickHandler);

			window.addEventListener('resize', _setHeighMenu);
		},

		destroy() {
			if (!activated) return;

			/* Удаляем обработчики событий */
			$menu.removeEventListener('click', clickHandler);
			window.removeEventListener('resize', _setHeighMenu);

			/* Удаляем классы плагина на ссылках и кнопку назад */
			for (const $link of $menu.querySelectorAll('.link')) {
				if ($link.classList.contains('bro-menu__back')) {
					$link.closest('li').remove();
					continue;
				}

				$link.classList.remove('link');
				$link.classList.remove('bro-menu__next');
			}

			/* Удаляем классы плагина на вложеных менюшках	*/
			for (const $subMenu of $menu.querySelectorAll('.bro-menu__submenu')) {
				$subMenu.classList.remove('bro-menu__submenu')
			}

			/* Удаляем стрелки в ссылках */
			for (const $arr of $menu.querySelectorAll('.bro-menu__arr')) {
				$arr.remove();
			}



			$activeUl && $activeUl.classList.remove('active');

			$menu.style.height = '';
			$level_1.style.transform = ``;
			translate = 0;
			activated = false;
		}
	}

	function clickHandler(e) {
		const target = e.target;

		if (target.closest('.bro-menu__next')) {
			e.preventDefault();

			const $nestedMenu = target.closest('li').querySelector('ul');

			if ($activeUl) $activeUl.classList.remove('active');

			$nestedMenu.classList.add('active');
			$nestedMenu.style.visibility = 'visible';
			translate -= 100;

			$level_1.style.transform = `translateX(${translate}%)`;
			$activeUl = $nestedMenu;

			scrollToVisible($activeUl);
			_setHeighMenu();
		}
		else if (target.closest('.bro-menu__back')) {
			e.preventDefault();

			const $upperMenu = $activeUl.parentElement.closest('ul');
			$upperMenu.classList.add('active');

			$activeUl.style.visibility = '';

			translate += 100;

			$level_1.style.transform = `translateX(${translate}%)`;
			$activeUl.classList.remove('active');
			$activeUl = $upperMenu;
			_setHeighMenu();
		}
	}

	function _addBtnNext(elem) {
		elem.classList.add('link')
		elem.insertAdjacentHTML('beforeend', `
			${defaulOptions.arrow}
		`);

		elem.lastElementChild.classList.add('bro-menu__arr');
	}

	function _addBtnBack(elem, link) {
		const href = link.getAttribute('href');

		elem.insertAdjacentHTML('afterbegin', `
			<li>
				<a class="bro-menu__back link" ${(href) ? `href=${href}` : ''}>
					${defaulOptions.arrow}
					${link.textContent}
				</a>
			</li>
		`);
	}

	function _setHeighMenu() {
		if (!$activeUl) return;

		$menu.style.height = $activeUl.offsetHeight + "px";
	}

	function scrollToVisible(el) {
		if (_getPosAbsWindow(el) > window.pageYOffset) return;

		backToTop(-10, _getPos(el));
	}

	function _getPosAbsWindow(elem) {
		const offsetTop = elem.getBoundingClientRect().top;

		return offsetTop - window.pageYOffset;
	}

	function _getPos(el) {
		return el.getBoundingClientRect().top + window.pageYOffset;
	}

	function backToTop(interval, to) {
		if (window.pageYOffset <= to) return;

		window.scrollBy(0, interval);
		setTimeout(() => {
			backToTop(interval, to)
		}, 0);
	}

	return method;
}

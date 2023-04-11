(function () {
	const header = () => {
		const body = document.querySelector('body');
		const openBtn = document.querySelector('.header__offcanvas-toggle');
		const closeBtn = document.querySelector(
			'.header__offcanvas-toggle-link--close',
		);
		const offMenu = document.querySelector('.header__offcanvas-menu');
		const searchDetails = document.querySelector('.header__details');
		const openSearchBtn = document.querySelector('.header__search');
		const searchModal = document.querySelector('.search-modal');
		const submenuDetails = document.querySelectorAll(
			'.header__submenu li details',
		);

		const openMenu = (e) => {
			e.preventDefault();
			offMenu.classList.add('header__offcanvas-menu--open');
			openBtn.classList.add('active');
			body.classList.add('body--hidden');
		};

		const closeMenu = () => {
			offMenu.classList.remove('header__offcanvas-menu--open');
			openBtn.classList.remove('active');
			body.classList.remove('body--hidden');
		};

		openBtn.addEventListener('click', openMenu);
		closeBtn.addEventListener('click', closeMenu);

		openSearchBtn.addEventListener('click', () => {
			if (searchDetails.open) {
				body.classList.add('body--hidden');
				setTimeout(() => {
					searchModal.classList.add('search-modal--overflow');
				}, 1000);
			} else {
				body.classList.remove('body--hidden');
				searchModal.classList.remove('search-modal--overflow');
			}
		});

		submenuDetails.forEach((targetDetail) => {
			targetDetail.addEventListener('click', () => {
				submenuDetails.forEach((detail) => {
					if (detail !== targetDetail) {
						detail.removeAttribute('open');
					}
				});
			});
		});

		document.addEventListener('keyup', (e) => {
			if (e.key === 'Escape') {
				closeMenu();
				searchDetails.removeAttribute('open');
			}
		});
	};

	document.addEventListener('shopify:section:load', header);

	header();
})();

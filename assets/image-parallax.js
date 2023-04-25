(function () {

	const imageParallax = () => {

		document.addEventListener('scroll', function () {

			const elem = $('.image-parallax-section');
			const scroll = $(this).scrollTop();
			const elemH = elem.outerHeight();
			const elOffset = elem.offset().top;

			if (scroll > elOffset && scroll < elemH + elOffset) {
				$('.image-section__image-wrapper').css('transform', `scale(${(100 + (scroll - elOffset)/20)/100})`);
			}

		});

	}

	imageParallax();

	document.addEventListener('shopify:section:load', function () {
		imageParallax();
	});

})();
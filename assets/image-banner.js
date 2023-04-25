(function () {
	let heroSlide = () => {
		var $slickElement = $('.hero-section__list').not('.slick-initialized');

		$slickElement.slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			autoplaySpeed: 1,
			speed: 2500,
			variableWidth: true,
			autoplay: true,
			infinite: true,
			arrows: false,
			dots: false,
			cssEase: 'linear',
			pauseOnHover: true,
		});
	};

	document.addEventListener('shopify:section:load', function () {
		heroSlide();
	});

	heroSlide();
})();

(function () {

	const imageCollage = () => {
		const imageCollageSection = document.querySelector('.image-collage-section');
		const images = imageCollageSection.querySelectorAll('.js-parallax');
		const arr = [-75, -50, -150, -100, -85];

		images.forEach((image, i) => {
			image.setAttribute('data-parallax-property-value', arr[i]);
		});
	}

	imageCollage();
	document.addEventListener('shopify:section:load', function () {
		imageCollage();
	});

})();

(function () {
	document.addEventListener("shopify:section:load", function (e) {
		$(".product__media-list").flickity({
			pageDots: false,
			prevNextButtons: false,
			adaptiveHeight: true,
			wrapAround: true,
			fade: true,
		});

		$(".product__media-sublist").flickity({
			asNavFor: ".product__media-list",
			contain: true,
			pageDots: false,
			prevNextButtons: false,
		});
	});
})();

(function () {
	const initProductAccordion = () => {
		$(".product__additional").click(function () {
			if (!$(this).hasClass("active")) {
				$(".product__additional.active").removeClass("active");
				$(this).addClass("active");
				$(".product__additional-description")
					.hide()
					.eq($(this).index())
					.slideDown(300);
			}
		});
	};

	document.addEventListener("shopify:section:load", function () {
		$(".product__media-list").flickity({
			pageDots: false,
			prevNextButtons: false,
			adaptiveHeight: true,
			wrapAround: true,
			on: {
				select: function (index) {
					let slides = $(".product__media-list .product__media-item");

					var iframe = $(slides[index]).find("iframe");

					var allIframes = $(".product__media-list").find("iframe");
					var video = $(slides[index]).find("video");
					var allVideos = $(".product__media-list").find("video");

					if (video && video.length > 0) {
						video.get(0).play();
					} else if (allVideos && allVideos.length > 0) {
						allVideos.get(0).pause();
					}

					if (iframe && iframe.length > 0) {
						iframe[0].contentWindow.postMessage(
							JSON.stringify({ event: "command", func: "playVideo" }),
							"*",
						);
					} else if (allIframes && allIframes.length > 0) {
						allIframes[0].contentWindow.postMessage(
							JSON.stringify({ event: "command", func: "pauseVideo" }),
							"*",
						);
					} else {
						return false;
					}
				},
			},
		});

		$(".product__media-sublist").flickity({
			asNavFor: ".product__media-list",
			contain: true,
			pageDots: false,
			prevNextButtons: false,
			cellAlign: "left",
		});

		initProductAccordion();
		initModal("fancy-container-info");
	});

	initModal("fancy-container-info");
	initProductAccordion();
})();

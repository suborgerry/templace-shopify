//Quick View

$(document).ready(function () {
	$.getScript(
		"//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js",
	).done(function () {
		quickView();
	});
});

function quickView() {
	$(".quick-view").click(function (e) {
		let content;
		e.preventDefault();
		if ($("#quick-view").length == 0) {
			$("body").append(
				'<div id="quick-view">' +
					'<a href="#" class="modal-close-button fancybox-close-button" onclick="$.fancybox.close(); event.preventDefault();"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 14 14">\n' +
					'<rect y="12.728" width="18" height="1.5" transform="rotate(-45 0 12.728)" fill="currentColor"/>\n' +
					'<rect x="1.06055" width="18" height="1.5" transform="rotate(45 1.06055 0)" fill="currentColor"/>\n' +
					"</svg></a>" +
					'<div class="qv-content">' +
					'<div class="qv-wrapper"></div></div></div>',
			);
		}
		var product_handle = $(this).data("handle");
		$("#quick-view").addClass(product_handle);
		$.ajax({
			url: "/products/" + product_handle,
		}).done(function (text) {
			const newDiv = document.createElement("div");
			newDiv.innerHTML = text;

			$(newDiv).find(".product__additional-wrapper").remove();
			$(newDiv).find(".shopify-payment-button").remove();
			$(newDiv).find(".share-buttons").remove();
			$(newDiv).find(".product__pickup-availabilities").remove();
			$(newDiv).find(".pickup-availability-preview").remove();
			$(newDiv).find(".product__text").remove();
			$(newDiv).find(".product__tags").remove();
			$(newDiv).find(".product__info-wrapper .modals").remove();
			$(newDiv).find(".js-media-sublist").remove();
			$(newDiv).find(".product__media-toggle").remove();
			$(newDiv).find(".product__media-icon").remove();
			$(newDiv).find(".product-recommendations--single").remove();
			let scripts = $(newDiv).find("script");

			for (let i = 0; i < scripts.length; i++) {
				let source = "" + $(scripts[i]).attr("src");

				if (source) {
					if (
						source.indexOf("copy.js") > -1 ||
						source.indexOf("pickup-availability.js") > -1
					) {
						$(scripts[i]).remove();
					}
				}
			}

			if (theme.quickviewMore.length > 0) {
				$(newDiv).find(".product-form__buttons").append(`
					<a class='product-form__buttons-more' href='${"/products/" + product_handle}'>${
					theme.quickviewMore
				}</a>
				`);
			}

			$(newDiv)
				.find(".product-form__submit")
				.removeClass("button--secondary")
				.addClass("button--arrow");
			$(newDiv)
				.find(".product-form__submit")
				.append(
					"<svg\n" +
						'  viewBox="0 0 22 16"\n' +
						'  fill="none"\n' +
						'  aria-hidden="true"\n' +
						'  focusable="false"\n' +
						'  role="presentation"\n' +
						'  class="icon icon-button-arrow"\n' +
						'  xmlns="http://www.w3.org/2000/svg"\n' +
						">\n" +
						'  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7244 7.5C13.8017 6.1141 11.7355 3.30033 11.5001 0H12.374C12.7077 4.23944 16.3735 7.57895 20.8465 7.57895C21.0664 7.57895 21.2844 7.57087 21.5001 7.55502V8.44498C21.2844 8.42913 21.0664 8.42105 20.8465 8.42105C16.3735 8.42105 12.7077 11.7606 12.374 16H11.5001C11.7355 12.6997 13.8017 9.8859 16.7244 8.5H0.499878V7.5H16.7244Z" fill="currentColor"/>\n' +
						"</svg>\n",
				);

			content = $(newDiv).find(".product-section");

			$("#quick-view .qv-wrapper")
				.append(content)
				.each(function () {
					setTimeout(() => {
						$(".js-media-list").flickity({
							pageDots: false,
							prevNextButtons: false,
							adaptiveHeight: true,
							wrapAround: true,
						});

						$(".product__media-list-wrapper-outer-arrow_prev").on(
							"click",
							function () {
								$(".product__media-list").flickity("previous");
							},
						);
						$(".product__media-list-wrapper-outer-arrow_next").on(
							"click",
							function () {
								$(".product__media-list").flickity("next");
							},
						);
					}, 100);

					if ($(".product__description").outerHeight() > 50) {
						$(".product__description").height("43.66px");
						$(".product__description").append(
							'<a href="#" class="product__description-more">Read more</a>',
						);
						$(".product__description-more").click(function (e) {
							e.preventDefault();
							$(this).hide();
							$(".product__description").height("auto");
						});
					}
				});
		});

		$.fancybox({
			href: "#quick-view",
			maxWidth: 1076,
			minHeight: $(window).width() < 750 ? 800 : 600,
			fitToView: true,
			width: "100%",
			autoSize: false,
			closeClick: false,
			openEffect: "none",
			closeEffect: "none",
			closeBtn: false,
			beforeLoad: function () {
				var product_handle = $("#quick-view").attr("class");
				$(".fancybox-wrap").css("overflow", "hidden !important");
			},
			afterShow: function () {
				if (theme.quickviewText.length > 0) {
					$(".fancybox-outer").append(`
					<div class = "qv-announcement color-inverse">
						${theme.quickviewText}
					</div>
					`);
				}
			},
			afterClose: function () {
				$("#quick-view").removeClass();
				$("#quick-view .qv-wrapper").empty();
			},
		});
	});
}

document.addEventListener("shopify:section:load", function () {
	quickView();
});

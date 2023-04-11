$(document).ready(function () {
	let collectionListHover = () => {
		$('.categories-list__link').mousemove(function (event) {
			const mainSection = $(this)
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.parent();
			const parentSection = $(this)
				.parent()
				.parent()
				.parent();
			let image = $(this).parent().parent().find('.categories-list__media');
			image.css({
				left: event.pageX - ((mainSection.width() - parentSection.width()) / 2),
				top: event.pageY - parentSection.offset().top,
			});
		});
	};

	document.addEventListener('shopify:section:load', function () {
		collectionListHover();
	});

	collectionListHover();
});

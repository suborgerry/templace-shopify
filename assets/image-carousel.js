(function () {
	let imageSlide = () => {
		const slideshowElements = document.querySelectorAll(".image-section__list");

		slideshowElements.forEach((slideshowEl) => {
			let slides = slideshowEl.querySelectorAll(".slider__slide");
			let allSlideWidths = 0;

			let flickity;
			let isPaused = false;

			slides.forEach((slide) => {
				let slideWidth = slide.offsetWidth;
				allSlideWidths += slideWidth;
			});

			if (!slideshowEl.classList.contains("flickity-enabled")) {
				let slidesWidth = slideshowEl.offsetWidth;
				let slidesHTML = slideshowEl.innerHTML;
				let duplicateCounter = Math.ceil(slidesWidth / allSlideWidths) + 1;

				for (let i = 0; i < duplicateCounter; i++) {
					slideshowEl.innerHTML = slideshowEl.innerHTML + slidesHTML;
				}
			}

			let tickerSpeed = -1;

			if (slideshowEl.classList.contains("js-slideshow_reverse")) {
				tickerSpeed = -1;
			} else {
				tickerSpeed = 1;
			}

			let update = () => {
				if (isPaused) {
					return;
				}
				if (flickity.slides) {
					flickity.x = (flickity.x - tickerSpeed) % flickity.slideableWidth;
					flickity.selectedIndex = flickity.dragEndRestingSelect();
					flickity.updateSelectedSlide();
					flickity.settle(flickity.x);
				}
			};

			if (!slideshowEl.classList.contains("has-interval")) {
				setInterval(function () {
					update();
					slideshowEl.classList.add("has-interval");
				}, 30);
			}

			flickity = new Flickity(slideshowEl, {
				autoPlay: false,
				freeScroll: true,
				prevNextButtons: false,
				pageDots: false,
				draggable: false,
				wrapAround: true,
				selectedAttraction: 0.015,
				friction: 0.25,
			});

			flickity.x = 0;

			$(slideshowEl).on("mouseenter", () => {
				let isStop = slideshowEl.getAttribute("data-pouse-on-hover") === "true";
				if (isStop) {
					isPaused = true;
				}
			});

			$(slideshowEl).on("mouseleave", () => {
				let isStop = slideshowEl.getAttribute("data-pouse-on-hover") === "true";
				if (isStop) {
					isPaused = false;
				}
			});

			update();
		});
	};

	document.addEventListener("shopify:section:load", function () {
		setTimeout(() => {
			imageSlide();
		}, 300);
	});

	imageSlide();
})();

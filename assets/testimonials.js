(function () {
	const testimonialsSlide = () => {
		const splitWords = () => {
			const splitSlider = new SplitType(
				document.querySelectorAll(".testimonials__slide-text"),
			);

			const texts = document.querySelectorAll(".testimonials__slide-text");
			texts.forEach((text) => {
				Array.from(text.children).forEach((line, i) => {
					Array.from(line.children).forEach((element) => {
						element.style.animationDelay = `${i * 0.15}s`;
					});

					if (i === 0) {
						setTimeout(() => {
							line.style.overflow = "visible";
						}, 650);
					} else {
						setTimeout(() => {
							line.style.overflow = "visible";
						}, 750 * i);
					}
				});
				text.classList.add("visible");
			});
		};

		const TestimonialsSliders = document.querySelectorAll(
			".testimonials__slider",
		);

		const slideActivate = function (sliderWrapper, slides, activeIdnex) {
			slides.forEach((slide, index) => {
				if (index === activeIdnex) {
					slide.classList.add("active");
					sliderWrapper.style.height = slide
						.querySelector(".testimonials__slide-text")
						.getBoundingClientRect().height;
				} else {
					slide.classList.remove("active");
				}
			});
		};

		TestimonialsSliders.forEach((slider) => {
			const slides = slider.querySelectorAll(".testimonials__slide");
			sliderWrapper = slider.querySelector(".testimonials__wrapper");
			sliderActiveIndex = 0;
			slideActivate(sliderWrapper, slides, sliderActiveIndex);

			const prevButton = slider.querySelector(".testimonials__button--prev");

			prevButton.onclick = () => {
				if (sliderActiveIndex === 0) {
					sliderActiveIndex = slides.length - 1;
				} else {
					sliderActiveIndex = sliderActiveIndex - 1;
				}

				slideActivate(sliderWrapper, slides, sliderActiveIndex);

				splitWords();
			};

			const nextButton = slider.querySelector(".testimonials__button--next");

			nextButton.onclick = () => {
				if (sliderActiveIndex === slides.length - 1) {
					sliderActiveIndex = 0;
				} else {
					sliderActiveIndex = sliderActiveIndex + 1;
				}

				slideActivate(sliderWrapper, slides, sliderActiveIndex);
				splitWords();
			};
		});

		const slideObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					splitWords();
					slideObserver.unobserve(entry.target);
				}
			});
		});

		const resizeObserver = new ResizeObserver(
			debounce((entries) => {
				splitWords();
				slideObserver.observe(sliderWrapper);
			}),
			500,
		);

		resizeObserver.observe(sliderWrapper);
		slideObserver.observe(sliderWrapper);
	};

	document.addEventListener("shopify:section:load", function () {
		testimonialsSlide();
	});

	testimonialsSlide();
})();

(function () {
	const headingAnimation = () => {
		const headings = document.querySelectorAll('.js-split-text');

		const splitHeadings = () => {
			const split = new SplitType(
				document.querySelectorAll('.js-split-text p'),
			);
			headings.forEach((heading) => {
				heading.classList.add('visible');
			});
		};

		const animateLines = (lines) => {
			lines.forEach((line, i) => {
				line.classList.add('animated');
				Array.from(line.children).forEach((element) => {
					element.style.animationDelay = `${i * 0.3}s`;

					setTimeout(() => {
						line.style.overflow = 'visible';
					}, 400 * (i + 1));
				});
			});
		};

		const headingObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const lines = entry.target.querySelectorAll('.line:not(.testimonials__slide-text .line)');
						animateLines(lines);
						headingObserver.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: "0px 0px -100px 0px"
			},
		);

		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				const lines = entry.target.querySelectorAll('.line:not(.testimonials__slide-text .line)');
				splitHeadings(lines);
				animateLines(lines);
				headings.forEach((heading) => {
					headingObserver.observe(heading);
				});
			});
		});

		splitHeadings();
		headings.forEach((heading) => {
			headingObserver.observe(heading);
			resizeObserver.observe(heading);
		});
	};

	document.addEventListener('shopify:section:load', headingAnimation);

	window.addEventListener('load', headingAnimation);
})();

(() => {
    const swiper = new Swiper('.vertical-testimonials-swiper', {
        direction: 'horizontal',
        slidesPerView: 1,
        centeredSlides: true,
        // autoplay: {
        //     delay: 5000,
        // },
        pagination: {
            el: ".vertical-testimonials__pagination",
            clickable: true,
        },
        breakpoints: {
            768: {
                direction: 'vertical'
            }
        }
    });
})();
(() => {
    const textSlider = document.querySelector('.text-slider');
    const parentHeight = textSlider.clientHeight;
    const sliderItems = textSlider.querySelectorAll('.text-slider__slide');

    sliderItems.forEach(item => {
        item.style = `--parent-height: ${parentHeight}`
    });

    const swiper = new Swiper('.text-slider', {
        slidesPerView: 3,
        direction: 'vertical',
        freeMode: true,
        enabled: false,
        breakpoints: {
            990: {
                // enabled: true,
                slidesPerView: 3.25,
                // centeredSlides: true,
                // initialSlide: 1,
                direction: 'horizontal'
            }
        }
    });


})();
(() => {
    const textSlider = document.querySelector('.payment-methods');
    const parentHeight = textSlider.clientHeight;
    const sliderItems = textSlider.querySelectorAll('.payment-methods__slide');

    sliderItems.forEach(item => {
        item.style = `--parent-height: ${parentHeight}`
    });

    const swiper = new Swiper('.payment-methods', {
        slidesPerView: 3,
        direction: 'vertical',
        freeMode: true,
        enabled: false,
        breakpoints: {
            990: {
                // enabled: true,
                slidesPerView: 3.1,
                // centeredSlides: true,
                // initialSlide: 1,
                direction: 'horizontal'
            }
        }
    });
})();
(() => {
    // Получаем все элементы с классом "vertical-testimonials__slide"
    const slides = document.querySelectorAll('.vertical-testimonials__slide');

    // Инициализируем переменную для хранения максимальной высоты
    let maxHeight = 0;

    // Перебираем все слайды и находим максимальную высоту
    slides.forEach(slide => {
        const slideHeight = slide.offsetHeight;
        if (slideHeight > maxHeight) {
            maxHeight = slideHeight;
        }
    });
    console.log(maxHeight);
    if (window.innerWidth <= 768) {
        maxHeight = maxHeight + 80
    }
    console.log(maxHeight);

    // Находим элемент с классом "vertical-testimonials-swiper" и назначаем ему максимальную высоту
    const verticalTestimonialsSwiper = document.querySelector('.vertical-testimonials-swiper');
    verticalTestimonialsSwiper.style = `--height-reviews: ${maxHeight}px`

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
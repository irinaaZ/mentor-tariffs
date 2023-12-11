import "swiper/swiper-bundle.css";
import 'swiper/css/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swiper from "swiper/bundle";

var swiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    loop: true,
    speed: 400,
    spaceBetween: 100,
    slidesPerView: 1,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: "progressbar",
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
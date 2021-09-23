jQuery(function($) {
    // Galleries
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 20,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        direction: 'vertical',
    });
    var galleryTop = new Swiper('.swiper-container-laptop', {
        speed: 800,
        autoplay: {
            delay: 5000,
        },
        thumbs: {
            swiper: galleryThumbs
        }
    });

    const testimonialSlider = new Swiper('.testimonial-slider', {
        speed: 400,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
    });
    
	// Smooth scroll
  	$('a[href*="#"]').smoothscroll();



    // Perspective effect
    var card = $('.green-box');
    card.on('mousemove', function (e) {
        var x = e.clientX - $(this).offset().left + $(window).scrollLeft();
        var y = e.clientY - $(this).offset().top + $(window).scrollTop();

        var rY = map(x, 0, $(this).width(), -17, 17);
        var rX = map(y, 0, $(this).height(), -17, 17);

        $(this).children(".gb-inner").css("transform", "rotateY(" + rY + "deg)" + " " + "rotateX(" + -rX + "deg)");
    });

    card.on('mouseenter', function () {
        $(this).children(".gb-inner").css({
            transition: "all " + 0.05 + "s" + " linear",
        });
    });

    card.on('mouseleave', function () {
        $(this).children(".gb-inner").css({
            transition: "all " + 0.2 + "s" + " linear",
        });

        $(this).children(".gb-inner").css("transform", "rotateY(" + 0 + "deg)" + " " + "rotateX(" + 0 + "deg)");
    });

    function map(x, in_min, in_max, out_min, out_max)
    {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }


});
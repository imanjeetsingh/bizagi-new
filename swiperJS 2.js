$(".gallerySection").each(function() {
    var slideCount2 = $(this).find(".partner-logo").length;
    var galleryRMob = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-RMob"]').attr('data-rowCount-mobile');
    var galleryCMob = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-CMob"]').attr('data-colCount-mobile');
    var galleryRTab = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-RTab"]').attr('data-rowCount-tablet');
    var galleryCTab = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-CTab"]').attr('data-colCount-tablet');
    var galleryRDes = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-RDes"]').attr('data-rowCount-desktop');
    var galleryCDes = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-CDes"]').attr('data-colCount-desktop');
    var gallerySlideTab = 1;
    var gallerySlideDes = 1;
    var galleryAutoPlayDelay = $(this).parent(".gallery-carousel-inner").find('[data-id="gallery-AutoPlayDelay"]').attr('data-auto-play-delay');
    var galleryLoop = false;
    var navItemNamePrev = $(this).parent(".gallery-carousel-inner").find('.swiper-button-prev-two').attr('id');
    var navItemNameNext = $(this).parent(".gallery-carousel-inner").find('.swiper-button-next-two').attr('id');


    if (window.screen.width > 1023) {
        galleryLoop = slideCount2 > galleryRDes * galleryCDes ? true : false;
    } else if (window.screen.width > 767) {
        galleryLoop = slideCount2 > galleryRTab * galleryCTab ? true : false;
    } else if (slideCount2 > 1) {
        galleryLoop = true;
    }
    if (galleryRDes > 1 || galleryRTab > 1) {
        galleryLoop = false;
    } else if (galleryRDes == 1 || galleryRTab == 1) {
        if (!galleryLoop) {
            $(this).parent(".gallery-carousel-inner").find('.carousel-button').remove();
            $(this).parent(".gallery-carousel-inner").find(".swiper-wrapper").addClass('swiper-wrapper-center');
        }
    }
    var swiper = new Swiper(this, {

        slidesPerView: galleryCMob,
        autoplay: {
            delay: galleryAutoPlayDelay,
        },
        loop: galleryLoop,
        spaceBetween: 20,
        speed: 1500,
        slidesPerColumnFill: "row",
        pagination: {
            el: ".swiper-pagination-two",
        },
        navigation: {
            nextEl: "#" + navItemNameNext,
            prevEl: "#" + navItemNamePrev,
        },
        breakpoints: {
            767: {
                slidesPerView: galleryCTab,
                slidesPerColumn: galleryRTab,
                slidesPerGroup: gallerySlideTab,
                spaceBetween: 20,
            },
            1023: {
                slidesPerView: galleryCDes,
                slidesPerColumn: galleryRDes,
                slidesPerGroup: gallerySlideDes,
                spaceBetween: 20,
            },
        },
    });
});
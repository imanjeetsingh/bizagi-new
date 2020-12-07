$(".swiper-container").each(function() {
    var cardslideCount = $(this).find(".swiper-slide").length;
    var cardRMob = $(this).attr('data-mr');
    var cardCMob = $(this).attr('data-mc');
    var cardRTab = $(this).attr('data-tr');
    var cardCTab = $(this).attr('data-tc');
    var cardRDes = $(this).attr('data-dr');
    var cardCDes = $(this).attr('data-dc');
    var cardAutoPlayDelay = $(this).attr('data-delay');

    var cardSlideTab = cardRTab * cardCTab;
    var cardSlideDes = cardRDes * cardCDes;
    var cardLoop = false;
    var navItemName = $(this).parent(".card-container").find('.swiper-pagination-one').attr('id');


    var swiper = new Swiper(this, {

        autoplay: {
            delay: cardAutoPlayDelay,
        },
        slidesPerView: cardCMob,
        slidesPerColumn: cardRMob,
        spaceBetween: 0,
        speed: 1500,
        loop: false,
        slidesPerColumnFill: "row",
        pagination: {
            el: "#" + navItemName,
            clickable: true,
        },

        breakpoints: {
            767: {
                slidesPerView: cardCTab,
                slidesPerColumn: cardRTab,
                slidesPerGroup: cardslideCount % cardSlideTab === 0 ? cardSlideTab : 1,
                spaceBetween: 20,
            },
            1023: {
                slidesPerView: cardCDes,
                slidesPerColumn: cardRDes,
                slidesPerGroup: cardslideCount % cardSlideDes === 0 ? cardSlideDes : 1,
                spaceBetween: 20,
            },
        },
    });
});
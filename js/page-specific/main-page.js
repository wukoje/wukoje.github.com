"use strict";

$( document ).ready(function(){
    var catalogBestsellers = $('#carousel-bestsellers');
    var catalogNew = $('#carousel-new');

    mainPageResize();
    // initializing small carousels
    updateThumbs($('.catalog-item-thumbnails'));

    $('.main-page').on('mouseenter', '.catalog-item-thumbnails .slick-slide', function(){
        if ($(this).is('.slick-slide.active')) return;
        $(this).addClass('active').siblings().removeClass('active');
        var srcImg = $(this).find('img');
        var bigImg = $(this).closest('.catalog-item-thumbnails').siblings('a').find('img');
        bigImg.one('load', function(){
            bigImg.fadeIn('fast');
        }).fadeOut('fast', function(){
            bigImg.attr('src', srcImg.data('big-image'));
        });
    }).on({
        'slide.bs.carousel': function(){
            $(this).find('.carousel-inner').addClass('sliding');
        },
        'slid.bs.carousel': function(){
            $(this).find('.carousel-inner').removeClass('sliding');
            updateThumbs($('.item.active .catalog-item-thumbnails'));
        },
        swipeleft: function(){
            $(this).carousel('next');
        },
        swiperight: function(){
            $(this).carousel('prev');
        }
    }, '#carousel-bestsellers, #carousel-new');


    function mainPageResize(){
    	var nowInGroup = $('#carousel-bestsellers .item.active .catalog-item-container').length;
    	if (Modernizr.mq('(max-width: 767px)')){
    		if (nowInGroup != 1){
    			carouselRebuild(catalogBestsellers, 1, 0);
    			carouselRebuild(catalogNew, 1, 0);
    		}
    	} else if (Modernizr.mq('(min-width: 768px) and (max-width: 991px)')){
    		if (nowInGroup != 4){
    			carouselRebuild(catalogBestsellers, 4, 2);
    			carouselRebuild(catalogNew, 2, 0);
                updateThumbs($('.catalog-item-thumbnails'));
    		}
    	} else {
    		if (nowInGroup != 6){
    			carouselRebuild(catalogBestsellers, 6, 3);
    			carouselRebuild(catalogNew, 3, 0);
                updateThumbs($('.catalog-item-thumbnails'));
    		}
    	}
    }

    var timeout;
    $( window ).on('resize', function(){
    	clearTimeout(timeout);
    	timeout = setTimeout(mainPageResize, 300);
    })


})
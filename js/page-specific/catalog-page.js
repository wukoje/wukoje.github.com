"use strict";

$( document ).ready(function(){

    $('.catalog-item-thumbnails').on('mouseenter', '.slick-slide', function(){
        if ($(this).is('.slick-slide.active')) return;
        $(this).addClass('active').siblings().removeClass('active');
        var srcImg = $(this).find('img');
        var bigImg = $(this).closest('.catalog-item-thumbnails').siblings('a').find('img');
        setBigImage(bigImg, 'img', srcImg, true);
    })

    var catalog = $('.catalog').clone(true);
    catalogPageResize();
    function catalogRebuild(carousel, itemsToDisplay, itemsInRow){
        var items = carousel.find('.catalog-item-container');
        // deleting rows, if exist
        var wrapped = carousel.find('.row');
        if (wrapped.length > 0) items.unwrap();

        // deleting .item, if exist
        wrapped = carousel.find('.item');
        if (wrapped.length > 0) items.unwrap();

        // now we have fully unwrapped list of products to group them as needed
        groupItems(carousel, itemsToDisplay, '.catalog-item-container', 'item');
        if ($.isNumeric(itemsInRow)) {
            carousel.find('.item').each(function(){
                // dividing carousel items into rows
                groupItems($(this), itemsInRow, '.catalog-item-container', 'row');
            })
        }
    }
    var showBy = 6;
    function catalogPageResize(){
        if (Modernizr.mq('(max-width: 767px)')){
            catalogRebuild(catalog, showBy, 0);
            $('.catalog').replaceWith(catalog);
        } else if (Modernizr.mq('(min-width: 768px) and (max-width: 991px)')){
            catalogRebuild(catalog, showBy, 2);
            $('.catalog').replaceWith(catalog);
        } else {
            catalogRebuild(catalog, showBy, 3);
            $('.catalog').replaceWith(catalog);
        }
        $('[data-original-title]').each(function(){
            var $t = $(this),
                text = $t.attr('data-original-title');
            $t.removeData('bs.tooltip').removeAttr('data-original-title').attr('title', text).tooltip({
                'trigger': 'hover'
            });
        });
    }

    // switching catalog display type between blocks, list and table
    $('.view-type-switcher button').on('click', function(){
        var box = $(this).siblings('.box');
        if ($(this).hasClass('btn-blocks')){
            box.addClass('v-blocks').removeClass('v-table v-list');

            $('.catalog').stop(true, true).fadeOut(300, function(){
                $(this).removeClass('catalog-list catalog-table').addClass('catalog-blocks').fadeIn(300, function(){
                    var carousels = $(this).find('.catalog-item-thumbnails');
                    carousels.each(function(){
                        if ( !$(this).hasClass('slick-initialized') ){
                            $(this).slick({
                                slidesToShow: 4,
                                infinite: false,
                                focusOnSelect: true,
                                onInit: function(slick){
                                    slick.$slides.eq(0).addClass('active');
                                },
                            });
                        }
                    })
               });
            });
        }
        else if ($(this).hasClass('btn-list')){
            box.addClass('v-list').removeClass('v-table v-blocks');
            $('.catalog').stop(true, true).fadeOut(300, function(){
                $(this).removeClass('catalog-blocks catalog-table').addClass('catalog-list').fadeIn(300);
            });
        }
        else if ($(this).hasClass('btn-table')){
            box.addClass('v-table').removeClass('v-blocks v-list');
            $('.catalog').stop(true, true).fadeOut(300, function(){
                $(this).removeClass('catalog-list catalog-blocks').addClass('catalog-table').fadeIn(300);
            });
        } 
    });

    var timeout;
    $( window ).on('resize', function(){
        clearTimeout(timeout);
        timeout = setTimeout(catalogPageResize, 300);
    })
});
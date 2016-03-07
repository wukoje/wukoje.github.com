"use strict";

$(document).ready(function(){
	var thumbWidth = 80; // this is "user-defined"! Our thumbnails has 80px width
	// settings breakpoints for slider width up to 2000px
	var breakpoints = [];
	for (var i = 2; i*thumbWidth <= 2000; i++){
		breakpoints.push({
			breakpoint: thumbWidth*i,
			settings: { slidesToShow: i-1}
		})
	}
	var defaultSlides = i-1;
	//^ JS allows us to see i even after the for cycle is over. Here I use this trick.

	// initializing medium carousel
	var mediumCarousel = $('#medium-image').slick({
		slidesToShow: 1,
		infinite: false,
		onBeforeChange: function(slick, curSlide, animSlide){
			formedium.slickGoTo(animSlide);
			formedium.getSlick().$slides.eq(animSlide).addClass('active').siblings().removeClass('active');
		}
	});

	// small carousel initialization
	var formedium = $('#formedium').slick({
		focusOnSelect: true,
		slidesToShow: defaultSlides,
		infinite: false,
		respondTo: 'min',
		responsive: breakpoints,
		asNavFor: mediumCarousel,
		onInit: function(slick){
			var $slides = slick.$slides,
				cur = mediumCarousel.slickCurrentSlide();

			$slides.eq(cur).addClass('active');
		},
		onBeforeChange: function(slick, curSlide, animSlide){
			var $slides = slick.$slides;
			$slides.eq(animSlide).addClass('active')
				.siblings('.active').removeClass('active');
		}
	})	

	var bigModal = $('#modal-product-big-image');
	var modalContent = bigModal.find('.modal-content');
	var bigImg = bigModal.find('img.big-image');
	var btnBigNext = bigModal.find('.btn-modal-control.next');
	var btnBigPrev = bigModal.find('.btn-modal-control.prev');
	var modalThumbs;

	function modalSlide(slider, dir){
		
		var slides = slider.getSlick().$slides;
		var cur = slides.filter('.active').index();

		switch (dir){
			case 'next':
				if (cur !== slides.length - 1){ cur++;}
			break;
			case 'prev':
				if (cur !== 0){ cur--;}
			break;
			default:
				if ( !isNaN(dir) ){
					if ( cur == dir ) return;
					cur = dir;
				}
		}
		
		slides.eq(cur).addClass('active')
			.siblings('.active').removeClass('active');
		slider.slickGoTo(cur);
		
		var targetImg = slides.eq(cur).find('img');
		if ( cur < slides.length-1 && btnBigNext.hasClass('disabled') ){
			btnBigNext.removeClass('disabled');
		}
		if ( cur > 0 && btnBigPrev.hasClass('disabled') ){
			btnBigPrev.removeClass('disabled');
		}
		if ( cur === slides.length-1 ) btnBigNext.addClass('disabled');
		if ( cur === 0 ) btnBigPrev.addClass('disabled');
		setBigImage(bigImg, 'img', targetImg, true);

	}

	var modalThumbsInitOptions = {
		slidesToShow: defaultSlides,
		initialSlide: formedium.find('.active').index(),
		infinite: false,
		easing: false,
	    respondTo: 'min',
	    responsive: breakpoints,

	    onInit: function () {
	    	var $slider = this.$slider,
	    		$slides = this.$slides,
	    		slideCount = this.slideCount,
	    		rightLimit = slideCount - this.options.slidesToShow,
	    		cur = formedium.find('.active').index();
	    		setTimeout(function(){
	    			if ( cur > rightLimit ){
	    				$slider.slickGoTo(rightLimit);
	    			}
	    		}, 100);

	    	$slides.eq(cur).addClass('active').siblings('.active').removeClass('active');
	    	$slider.on('click', '.slick-next, .slick-prev', function(e){
	    		e.stopImmediatePropagation();
	    		if ($(this).hasClass('slick-next')){
	    			modalSlide($slider, 'next');
	    		} else {
	    			modalSlide($slider, 'prev');
	    		}
	    	}).on('click', '.slick-slide', function(e){
	    		e.stopImmediatePropagation();
	    		modalSlide($slider, $(this).index());
	    	});
	    },
	}
	bigModal.on('show.bs.modal', function(){
		setTimeout(function(){ // setTimeout for modal to show
			var curSlide = formedium.find('.active').index();
			var slides = formedium.getSlick().$slides.length;
			modalThumbs = bigModal.find('#modal-thumbnails').slick(modalThumbsInitOptions);
			
			if ( curSlide === slides-1){
				btnBigNext.addClass('disabled');
			} else if ( curSlide === 0){
				btnBigPrev.addClass('disabled');
			} else {
				btnBigNext.removeClass('disabled');
				btnBigPrev.removeClass('disabled');
			}
		 }, 500);
	});
	// resetting onBeforeChange after hiding modal to avoid slide animation on next opening
	bigModal.on('hide.bs.modal', function(){
		modalThumbs.unslick();
	});

	$('.modal-thumbnails').on('click', function(e){
		e.stopPropagation();
	})

	$('.medium-image, .zoom-controls').on('click', function(e){
		if ( $(e.target).is('.slick-prev, .slick-next') ) return;
		//^ if click on navigation arrows and not on image itself - return
		var targetImg = mediumCarousel.find('.slick-slide').eq(mediumCarousel.slickCurrentSlide()).find('img');
		setBigImage(bigImg, 'img', targetImg, false);

		bigModal.modal('show');
	});
	// $('.slick-prev, .slick-next').on('click', function(e){
	// 	e.stopPropagation();
	// })

	// to do: replace manual controls of img with another slick
	// slider with lazy loading (requires integration of my function
	// which defines container size, so some thinking needed here)
	bigModal.find('.btn-modal-control').on('click', function(){
		// immediately finish all current gallery animations
		// in case someone clicks this button really quick
		mediumCarousel.stop(true, true);
		bigImg.stop(true, true);

		if ($(this).hasClass('close')) return;
		if ($(this).hasClass('next')){
			modalSlide(modalThumbs, 'next');
		}
		if ($(this).hasClass('prev')){
			modalSlide(modalThumbs, 'prev');
		}
	});

	bigModal.on('swiperight', function(){
		// immediately finish all current gallery animations
		// in case someone clicks this button really quick
		mediumCarousel.stop(true, true);
		bigImg.stop(true, true);
		modalSlide(modalThumbs, 'prev');
	});
	bigModal.on('swipeleft', function(){
		// immediately finish all current gallery animations
		// in case someone clicks this button really quick
		mediumCarousel.stop(true, true);
		bigImg.stop(true, true);
		modalSlide(modalThumbs, 'next');
	});

	bigModal.on('click', function(){
		if (!Modernizr.mq('(max-width: 767px)')) return;
		$(this).find('.modal-content').toggleClass('hovered');
	});

	var timeHandler;

	function afterResize(){
		if (bigModal.is(':visible')){
			resizeImgContainer(modalContent, bigImg.get(0));
			//^ .get(0), not bigImg itself, because function waits for
			// img element as a parameter
			// !subject to change someday
			modalThumbs.unslick();
			setTimeout(function(){
				modalThumbs.slick(modalThumbsInitOptions);
			}, 200);
		}
		mediumCarousel.slickSetOption('','',true);
		formedium.slickSetOption('','',true);
	}
	$(window).resize(function(){
		clearTimeout(timeHandler);
		timeHandler = setTimeout(afterResize, 400);
	});

});

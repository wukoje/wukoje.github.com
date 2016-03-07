"use strict";

(function(){
	// rating star click processing
	$('.rating-star').on('click', function(e){
		$(this).nextAll().removeClass('active');
		$(this).prevAll().addBack().addClass('active');
		return false;
	});
	// rating star hover processing
	$('.rating-star').hover(function(e){
		$(this).nextAll().removeClass('hovered');
		$(this).prevAll().addBack().addClass('hovered');
	}, function(e){
		$(this).siblings().addBack().removeClass('hovered');
	});
	$('.rating-star').on({
		mousedown: function(){
			$(this).nextAll().removeClass('clicked');
			$(this).prevAll().addBack().addClass('clicked');
		}, 
		mouseup: function(e){
			$(this).siblings().addBack().removeClass('clicked');
		}
	});
})();
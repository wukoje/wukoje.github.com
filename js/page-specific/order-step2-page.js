"use strict";

$( document ).ready(function(){
	$('.buyer-info-toggle').on('click', function(e){
		e.preventDefault();
		$('.buyer-info').slideToggle(400, function(){
			// refresh styled selects, because they are not initialized properly
			// due to display: none on .buyer-info on page load
			var selects = $(this).find('select');
			selects.each(function(){
				$(this).trigger('refresh')
				.siblings('.jq-selectbox__dropdown')
				.find(' ul').mCustomScrollbar();
			});
		});

		$(this).toggleClass('expanded');
	})
})

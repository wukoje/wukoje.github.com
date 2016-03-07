"use strict";

function closeToggles(){
	if($('.toggleable').is(':visible')){ 
		$('.toggleable').slideUp(300);
	}
}

function closeEverything(){
	$('.modal.in').modal('hide');
	$('.popup-on-buy').fadeOut('400');
}

$(document).ready(function(){

	$('.btn-toggle').on('click', function(){
		var $t = $(this);
		$t.toggleClass('btn-toggled');
		$( $t.data('target') ).toggleClass('toggled');
	});
	
});

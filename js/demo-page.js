"use strict";

$(window).on("load", function() {
	var h=$('a.thumbnail img').height();
	$('.cover').css('line-height',h+'px');
});
$(window).resize(function() {
	var h=$('a.thumbnail img').height();
	$('.cover').css('line-height',h+'px');
});
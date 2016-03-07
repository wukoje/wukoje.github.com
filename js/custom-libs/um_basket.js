"use strict";

var buzzTimeout;
// function for visualizing addition of items into basket.
function addToBasket(basketItemsSpan, basketBtn){
	var basketItems = parseFloat(basketItemsSpan.html());

	basketBtn.addClass('buzz'); // class for animation (set in CSS)
	clearInterval(buzzTimeout);
	buzzTimeout = setInterval(function(){
		basketBtn.removeClass('buzz');
	}, 1000);

	basketItems += 1;
	basketItemsSpan.html(basketItems);
}/*function addToBasket*/
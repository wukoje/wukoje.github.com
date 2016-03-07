"use strict";

function updateThumbs(thumbs){
	if (!thumbs.hasClass('slick-initialized')){
		thumbs.slick({
		    slidesToShow: 4,
		    infinite: false,
		    focusOnSelect: true,
		    onInit: function(slick){
		    	slick.$slides.eq(0).addClass('active');
		    },
		});
	} else {
		thumbs.slickSetOption('','',true);
	}
}

// Breaking catalog into groups with specified number of items in each of them.
// INPUT:
// catalog - jQuery object containing items (at any lvl) with specified class
// itemsInGroup - number of products in each group
// itemSelector - selector for each item (to find). Usually some class.
// Attention: it is SELECTOR, not CLASS. Right: '.item', wrong: 'item'
// wrapperClass - class of each group (to wrap with)
// OUTPUT
// each group is wrapped into div.{itemClass}
function groupItems(catalog, itemsInGroup, itemSelector, wrapperClass){
	var items = catalog.find(itemSelector).not('.hidden');

	// IMPORTANT! items to group must be siblings of each other, with
	// NO ADDITIONAL WRAPPING BETWEEN THEM. Otherwise, DOM-structure
	// will be broken badly.
	// in first versions of this function I used .unwrap() in case
	// there was already .{wrapperClass}, and that really works...
	// while there is only one level or wrapping. But what if more?
	// Then troubles come. So I've decided to drop unwrapping in this
	// function and let it be processed somewhere before it, depending on
	// specific structure used in each case.
	// Again: items to group must be all next to each other, on one level, 
	// with no other elements between them.

	// if itemsInGroup is not a number, or if number is not valid (<1),
	// then wrap all elements at once and return
	if (itemsInGroup < 1 || !$.isNumeric(itemsInGroup)){
		items.wrapAll('<div class="'+wrapperClass+'" />');
		return;
	}

	for (var i = 0; i < items.length; i += itemsInGroup){
		if ( (i+itemsInGroup) >= items.length){
			items.slice(i).wrapAll('<div class="'+wrapperClass+'" />');
			break;
		}
		items.slice(i, i+itemsInGroup).wrapAll('<div class="'+wrapperClass+'" />');
	}
}

// creating carousel controls.
// controls parameter must be jQuery object containing .carousel-indicators
// element of bootstrap's carousel
function createControls(carousel, controls){
	controls.empty();
	var itemsNumber = carousel.find('.item').length;
	if (itemsNumber == 1) return;
	for (var i = 0; i < itemsNumber; i++){
		controls.append('<li data-target="#'+
		carousel.attr('id')+'" data-slide-to="'+i+'"></li>');
	}
	controls.children(":first-child").addClass('active');
}

// function for rebuilding carousels (on window resize, for example)
// NOT UNIVERSAL! Created for specific carousel markup used in Apparel project.
// ! each carousel's .item may contain .row(s) !
// if itemsInRow is not defined or not numeric, then there will be no rows at all
// if itemsInRow < 1, then all products in each carousel group
// will be wrapped with one row as a whole
function carouselRebuild(carousel, itemsToDisplay, itemsInRow){
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
	
	carousel.find('.item:first-child').addClass('active');
	createControls(carousel, carousel.find('.slider-controls'));
}
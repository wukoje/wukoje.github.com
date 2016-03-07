// PAGINATION START
"use strict";

// pager = pagination class object containing .pagination-item including:
// .to-start and .to-end – "To start" and "To end" buttons
// .arrow.left and .arrow.right - left and right arrows
// Function parameters:
// object = 'start' / 'end' / 'both'
// state = 'disable' or 'enable'
function paginationStateToggle(pager, object, state){
	var objectsToChange;
	if (object == 'both') objectsToChange = pager.find('.to-start, .arrow.left, .to-end, .arrow.right');
	else if (object == 'start') objectsToChange = pager.find('.to-start, .arrow.left');
	else if (object == 'end') objectsToChange = pager.find('.to-end, .arrow.right');
	else return false;

	if (state == 'disable'){
		objectsToChange.addClass('disabled');
	} else if (state == 'enable') objectsToChange.removeClass('disabled');
	else return false;
}

// Return PAGE number, not an array element number!
// array element number = page number - 1
function getActivePage(pager){
	var pages = pager.find('.pagination-item').not('.to-start, .to-end, .arrow');
	var current = pager.find('.pagination-item.active');
	var activeItemIndex = $.inArray(current.get(0), pages);
	
	// if active page is not found than make first active
	if (activeItemIndex == -1){
		pages.eq(0).addClass('active');
		activeItemIndex = 1;
	} else activeItemIndex += 1;
	return activeItemIndex;
}

// setting the active page with the number pageNumber
// page number is not array element number!
// last = page number - 1

function setActivePage(pager, pageNumber){
	var pages = pager.find('.pagination-item').not('.to-start, .to-end, .arrow');
	
	// Don't give to go beyond the range of pages
	if (pageNumber < 1) pageNumber = 1;
	else if (pageNumber > pages.length) pageNumber = pages.length;

	// Switch the active class of the specified element
	pages.eq(pageNumber-1).addClass('active').siblings().removeClass('active');

	// toogle last buttons by default
	paginationStateToggle(pager, 'both', 'enable');

	// turn off the last buttons if the active element is last
	if (pageNumber == 1){
		paginationStateToggle(pager, 'start', 'disable');
	} // don't set else here, for it may be only one page, is's also first and last
	if (pageNumber == pages.length){
		paginationStateToggle(pager, 'end', 'disable');
	}
}

$( document ).ready(function(){
	// pagination initialization
	var pagination = $('.pagination');
	var pages = pagination.find('.pagination-item').not('.to-start, .to-end, .arrow');

	var currentActivePage = getActivePage(pagination);
	setActivePage(pagination, currentActivePage);

	$('.pagination-item').on('click', function(e){
		e.preventDefault();
		var pagination = $(this).parent('.pagination');
		var pages = pagination.find('.pagination-item').not('.to-start, .to-end, .arrow');
		if ($(this).hasClass('disabled') || $(this).hasClass('active')) return false;
		if ($(this).hasClass('to-start')){ setActivePage(pagination, 1);}
		else if ($(this).hasClass('to-end')){ setActivePage(pagination, pages.length);}
		else if ($(this).hasClass('left')){ 
			var currentActivePage = getActivePage(pagination);
			setActivePage(pagination, currentActivePage-1);
		} else if ($(this).hasClass('right')){
			var currentActivePage = getActivePage(pagination);
			setActivePage(pagination, currentActivePage+1);
		} else {
			var clicked = $.inArray(this, pages);
			setActivePage(pagination, clicked+1);
		}
	});
})
// PAGINATION END
"use strict";

// setting position of main menu submenu. It doesn't have width set, and will
// adjust it automatically to stay inside its positioned container.
// also, initially it has left: auto, so it will automatically position 
// itself right under menu item it belongs to.
// what we need to do: check if all its content fits in one line. If not,
// reposition submenu to right: 0 to stick to the right side of the container
// Important! Submenus must have fixed width set in CSS!
function processSubmenu(menuItem){
	if (!menuItem) return false;
	
	// looking for submenus big wrapper and quit if not found
	var wrapper = menuItem.find('.submenu-wrap');
	if (wrapper.length == 0 || !wrapper) return false;
	
	var subElements = wrapper.find('.submenu-lvl1');
	var subElemWidth = parseFloat(subElements.css('width'));
	//^ since Bootstrap uses border-box model, css('width') will give width
	// with paddings and borders
	// console.log('subElemWidth: '+subElemWidth);

	var maxWidth = subElements.length * subElemWidth;
	// console.log('maxWidth: '+maxWidth);
	
	// reset wrapper position in case it was moved earlier
	wrapper.css({
		'right': '',
	});
	
	var wrapperWidth = parseFloat(wrapper.css('width'));
	//^ current width of wrapper. If it is less than maxWidth, it means that
	// all submenus not fit into one row, and we need to change position
	// of wrapper
	// console.log('wrapperWidth: '+wrapperWidth);

	if (wrapperWidth < maxWidth){
		wrapper.css('right', '0px');
	}

	/*
	Of course, algorithm could be better and smarter, but I wanted it to be as
	simple as possible.
	*/
}
"use strict";

/*	
html markup for popups to work correctly:
	1. popupSwitch - any clickable element with
		REQUIRED class="um_popup-switch" - for selecting popups when 
			necessary (to close on ESC, for example)
			when popup is opened, .um_opened is added to this element
		REQUIRED data-popup-container="#some-id" - popup content container,
			for styling opened popup via selector
			".um_container-opened .um_popup-content"
		OPTIONAL data-popup-delayin="some-number" - delay before
			popup opening animation, in milliseconds, default 0
		OPTIONAL data-popup-delayout="some-number" - delay before
			popup closing animation, in milliseconds, default 0
		OPTIONAL data-popup-duration="some-number" - animation duration,
			in milliseconds, default 500. !TODO: separate durations for in and out
		OPTIONAL data-popup-animation="slide" - for slide animation. Any
			other values will lead to default fade animation
	2. REQUIRED any element, containing element with class um_popup-content. I use two elements instead of just popup-content, because sometimes popup's parent styling changes too on popup opening */
function umPopupToggle(popupSwitch, hide){
	hide = hide || false;

	// is it popup switch at all?
	if (!popupSwitch.hasClass('um_popup-switch')) return false;

	// does it have container specified?
	var container = $(popupSwitch.attr('data-popup-container'));
	if (container.length === 0){
		return false;
	}

	// does container has needed content?
	var content = container.find('.um_popup-content');
	if (content.length === 0){
		return false;
	}
	
	// close fast without animation?
	if (hide) {
		content.hide();
		container.removeClass('um_container-opened');
		popupSwitch.removeClass('um_opened');
		return true;
	}

	// if we got here after all checks above, then continue with normal
	// popup open/close processing
	var duration = parseInt(popupSwitch.attr('data-popup-duration'));
	if (isNaN(duration)) duration = 500;
	
	var delayIn = parseInt(popupSwitch.attr('data-popup-delayin'));
	if (isNaN(delayIn)) delayIn = 0;
	
	var delayOut = parseInt(popupSwitch.attr('data-popup-delayout'));
	if (isNaN(delayOut)) delayOut = 0;

	// do we need to position this popup next to its switch and analyze viewport limits?
	// or it has fixed position and doesn't need to be changed?
	var reposition = popupSwitch.attr('data-popup-reposition') == "yes" ? true : false;
	if (reposition) popupReposition(popupSwitch, popupSwitch);

	// final questions: open or close + slide or fade?
	var animationType = popupSwitch.attr('data-popup-animation');
	switch (animationType){
		case 'slide':
			if (!popupSwitch.hasClass('um_opened')){
				popupOpen(popupSwitch, container, content, duration, delayIn, 'slide');
			} else {
				popupClose(popupSwitch, container, content, duration, delayOut, 'slide');
			}
			break;
		case 'class': 	// popup animation set in CSS via class,
						// no additional animation needed
			if (!popupSwitch.hasClass('um_opened')){
				popupOpen(popupSwitch, container, content, duration, delayIn, 'class');
			} else {
				popupClose(popupSwitch, container, content, duration, delayOut, 'class');
			}
			break;
		default:
			if (!popupSwitch.hasClass('um_opened')){
				popupOpen(popupSwitch, container, content, duration, delayIn, 'fade');
			} else {
				popupClose(popupSwitch, container, content, duration, delayOut, 'fade');
			}
	}/* switch (animationType) */
}/* function umPopupToggle(popupSwitch)*/

function popupOpen(popupSwitch, container, content, duration, delay, animation){
	container.addClass('um_container-opened');
	popupSwitch.addClass('um_opened')
	switch (animation){
		case 'slide':
			content.delay(delay).slideDown(duration);
			break;
		case 'fade':
			content.delay(delay).fadeIn(duration);
			break;
		case 'class':
			// popup animation set in CSS via class,
			// no additional jQuery animation needed
			break;
		default:
			content.show();
	}
}

function popupClose(popupSwitch, container, content, duration, delay, animation){
	switch (animation){
		case 'slide':
			content.delay(delay).slideUp(duration, function(){
				container.removeClass('um_container-opened');
				popupSwitch.removeClass('um_opened');
			});
			break;
		case 'fade':
			content.delay(delay).fadeOut(duration, function(){
				container.removeClass('um_container-opened');
				popupSwitch.removeClass('um_opened');
			});
			break;
		case 'class':
			container.removeClass('um_container-opened');
			popupSwitch.removeClass('um_opened');
			// popup animation set in CSS via class,
			// no additional jQuery animation needed
			break;
		default:
			content.hide();
			container.removeClass('um_container-opened');
			popupSwitch.removeClass('um_opened');
	}
	$('body').removeClass('darken');
}


// helper function to check, whether popup is clicked.
// target must be e.target from parent onclick function(e), passed here
function umPopupIsClicked(popupSwitch, target){
	var content = $(popupSwitch.attr('data-popup-container')).find('.um_popup-content');

	// important note: container is NOT checked, only popup's content! 
	if (content.is(target) || content.has(target).length != 0) return true;

	return false;
}

// helper function to reposition popup window according to coordinates and 
// distance to window limits
function popupReposition(popupSwitch, target){
	var popup = $(popupSwitch.attr('data-popup-container'));
	var content = popup.find('.um_popup-content');
	// t for target; p for popup
	var tOffset = target.offset();
	var tWidth = target.width();
	var tHeight = target.outerHeight();
	var width = popup.outerWidth();
	var windowWidth = $(window).width();
	var newLeft = tOffset.left + tWidth + 12; // 12 is width of arrow
	var newTop = tOffset.top + tHeight - 55; // 55 subject to change
	if ( (newLeft+width) > windowWidth ){
		newTop = tOffset.top + tHeight + 12;
		newLeft = tOffset.left - 20;
		content.removeClass('arrow-left arrow-top-middle').addClass('arrow-top');
		if ( (newLeft+width) > windowWidth ){
			newLeft = 0;
			content.addClass('arrow-top-middle');
		}
		popup.css({ left: newLeft, top: newTop });
	} else {
		popup.css({ left: newLeft, top: newTop});
		content.removeClass('arrow-top arrow-top-middle').addClass('arrow-left');
	}
}

function closePopups(closeFast){
	if (closeFast){
		$('.um_popup-switch.um_opened').each(function(){
			umPopupToggle($(this), 'hide');
		});
	}
	else{
		$('.um_popup-switch.um_opened').each(function(){
			umPopupToggle($(this));
		});
	}
	$('body').removeClass('darken');
}

$( document ).ready(function(){
	// stop propagation for such cases as when the popup is inside some link
	// like in Apparel, when city select panel was inside the link which
	// opened that panel
	$('.um_popup-content').on('click', function(e){
		e.stopPropagation();
	})

	// TODO: REWORK algo comletely to correctly work with multiple switches on one popup
	// right now I'll use bad code just to make it work, because I don't have enough 
	// time to do it as it should be done.
	$('.order-number-link').on('click', function(e){
		e.preventDefault();
		if ($(this).hasClass('um_opened')){
			umPopupToggle($(this));
			return;
		} else {
			closePopups(true);
			umPopupToggle($(this));
		}
	});
	
	$('.basket-toggle-btn').on('click', function(e){
		e.preventDefault();

		var opened = $(this).hasClass('um_opened');
		if (!opened){
			closePopups();
			umPopupToggle($(this));
		} else closePopups();
		
	});

	$( window ).on('keydown', function(event){
		if ( 27 == event.keyCode ) {
			closePopups();
		}
	});

	$( document ).on('click', function(e){
		var target = e.target;

		// first, we check if clicked element is some popupSwitch or its children
		// if yes, then return, because we don't want to conflict with its handler
		if ($(target).hasClass('um_popup-switch') || 
			$(target).parents('.um_popup-switch').length != 0) return;

		// and second, check all opened popups. In fact, there always must be
		// not more than ONE popup opened, but who knows what can happen in real world...
		var openedPopups = $('.um_popup-switch.um_opened');
		openedPopups.each(function(){
			if (!umPopupIsClicked($(this),target)) {
				closePopups();
			}
		});
	});

	$( window ).resize(function(){
		if (Modernizr.mq('(max-width: 767px)')){
			return; // otherwise it executes on every scroll on Android o_O
		}
		closePopups();
	})
})

/* FOR FUTURE: may be option to darken whole screen on popup open? */
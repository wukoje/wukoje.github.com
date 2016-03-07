"use strict";

// little helper function, returns value in pixels (integer > 1) or
// in percents (0 >= value >= 1)
function getDimension(rawData){
	if (rawData === 'none'){
		rawData = 1;
	} else if (rawData.indexOf('%') !== -1){
		rawData = parseInt(rawData)/100;
	} else if (rawData.indexOf('px') !== -1){
		rawData = parseInt(rawData);
	}
	return rawData;
}

// set image's container width and height according to image's actual
// width and height, BUT taking into account window size and
// limits (max-weight, max-height) set in container styles in % or px
// important: image - NOT jQuery object!!!
function resizeImgContainer(container, image){
	var maxWidth = container.css('max-width');
	var maxHeight = container.css('max-height');
	maxWidth = getDimension(maxWidth);
	maxHeight = getDimension(maxHeight);
	
	// if percents, then calculate depending on window dimensions
	if (maxWidth <= 1) maxWidth *= $(window).width();
	if (maxHeight <= 1) maxHeight *= $(window).height();

	// minus paddings and borders, leaving space only for image
	// this is only usable for box-sizing: border-box
	var paddingBottom = parseInt(container.css('padding-bottom'));
	var paddingTop = parseInt(container.css('padding-top'));
	var paddingLeft = parseInt(container.css('padding-left'));
	var paddingRight = parseInt(container.css('padding-right'));
	var borderTop = parseInt(container.css('border-top-width'));
	var borderRight = parseInt(container.css('border-right-width'));
	var borderBottom = parseInt(container.css('border-bottom-width'));
	var borderLeft = parseInt(container.css('border-left-width'));
	
	maxHeight -= paddingBottom + paddingTop + borderBottom + borderTop;
	maxWidth -= paddingLeft + paddingRight + borderLeft + borderRight;

	var newWidth = image.naturalWidth;
	var newHeight = image.naturalHeight;
	var relation = newWidth / newHeight;

	if (newWidth > maxWidth){
		newWidth = maxWidth;
		newHeight = newWidth / relation;
	}
	if (newHeight > maxHeight){
		newHeight = maxHeight;
		newWidth = newHeight * relation;
	}
	// now we've got dimensions to fit the image, so final step
	// apply padding
	newHeight += paddingBottom + paddingTop + borderBottom + borderTop;
	newWidth += paddingLeft + paddingRight + borderLeft + borderRight;
	container.css({
		'width': newWidth,
		'height': newHeight
	});
}

// change bigImage (usually inside some modal) to new one,
// which src is get either from img with data-big-image attribute
// or via direct path passed as a parameter
// ------
// using bufferImage to avoid "flickering" on img change.
// first loading buffer img with needed src path, and on load
// changing src on actual bigImg
// ------
// srcType: 
// 'img': source must be jQuery object containing <img> with non-empty data-big-image attribute
// 'source': source must contain path to new big image
// default: bigImage doesn't change.
// ------
// animate: true if animation is needed (if we switching image, not opening it for the first time)
// and false if we just open the modal window for the first time
function setBigImage(bigImage, srcType, source, animate){
	var src = '';
	var alt = '';
	switch (srcType){
		case 'img':
			if ($(source).is('img') && $(source).attr('data-big-image')){
				src = source.attr('data-big-image');
				alt = source.attr('alt');
			} else return;
			break;
		case 'path':
			src = source;
			break;
		default: return;
	}

	var bufferImg = new Image();
	$(bufferImg).on('load', function(){
		// immediately finish all current gallery and image animations
		// in case someone try to switch images really quick
		source.stop(true, true);
		bigImage.stop(true, true);

		var parent = bigImage.parent();
		
		// actual image change
		if (!animate){
			// without animation (if we don't change images,
			// just opening big modal for first time)
			resizeImgContainer(parent, bufferImg);
			bigImage.attr({'src': src, 'alt': alt});
			bufferImg = null;
		} else {
			// or with animation (if we actually change images
			// inside already opened modal window)
			bigImage.fadeOut(300, function(){
				resizeImgContainer(parent, bufferImg);
				$(this).attr({'src': src, 'alt': alt});
			}).fadeIn(300, function(){
				bufferImg = null; // we don't need it anymore
			});

		}

		
	});
	// starting to load buffer image. When it is fully loaded,
	// its onload handler (^ right above ^) will be triggered
	$(bufferImg).attr({'src': src, 'alt': alt});
}
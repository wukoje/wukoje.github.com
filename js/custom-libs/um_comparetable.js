"use strict";

// creating fixed column, top-row and top-left cell
function createCompareTable(originalTable){
	// create a fixed column
	var col = originalTable.clone().removeAttr('id').appendTo('.compare-outer-wrapper').addClass('clone column');
	col.find('td').remove();
	col.find('thead th').not(':first-child').remove();

	// create a fixed header
	var head = originalTable.clone().removeAttr('id').appendTo('.compare-inner-wrapper').addClass('clone header');
	head.find('tbody').remove();
	head.find('.spacer').remove();

	// create a fixed upper left corner cell 
	var intersection = head.clone().appendTo('.compare-outer-wrapper').addClass('intersection');
	intersection.find('th').not(':first-child').remove();
}

// adjust the location of of sticking header:
// stickyHeader should contain header and intersection cell
function checkTop(stickyHeader, originalTable){
	var curTop = $(window).scrollTop() + 40;
	var scrollbarTop = originalTable.parents('.compare-inner-wrapper').find('.mCSB_scrollTools.mCSB_scrollTools_horizontal').offset({ top: $('.compare-table').find('.spacer').offset().top+1 });;
	var stickyHeight = stickyHeader.height();
	var origHeight = originalTable.height();
	var tableTop = originalTable.offset().top;
	var switchTop = originalTable.find('tbody').offset().top - stickyHeight;
	if (curTop > switchTop){
		stickyHeader.show();
		if (curTop + stickyHeight + 200 >= tableTop+origHeight){
			stickyHeader.offset({ top: tableTop+origHeight-stickyHeight-200 });
			scrollbarTop.offset({ top: tableTop+origHeight-200-5 })
		} else {
			stickyHeader.offset({ top: curTop });
			scrollbarTop.offset({ top: curTop+stickyHeight - 5 });
		}
		
	} else {
		stickyHeader.hide();
		scrollbarTop.offset({ top: originalTable.find('.spacer').offset().top+1 });
		
	}
}

function repaintSticky(original, col, head, topleft){
	// prescribe the column width and height of its rows
	col.width(original.find('thead th:first-child').outerWidth());
	var origRows = original.find('th:first-child');
	col.find('th').each(function(i){
		$(this).height(origRows.eq(i).height());
	});

	// write header width and all columns inside it
	head.width(original.width());
	var origCols = original.find('thead th');
	head.find('thead th').each(function(i){
		$(this).width(origCols.eq(i).width());
	});

	topleft.width(original.find('thead th:first-child').outerWidth());
	topleft.find('tr').height(head.find('th:first-child').outerHeight()-1);
	// ^ subtract 10 because of padding in styles. Otherwise, 
	// the cell is 10 pixels higher than necessary
}

$( document ).ready(function(){
	if (Modernizr.mq('(max-width: 767px)')){
		return;
	}
	var origTable = $('#compare-table');
	if ( origTable.length === 0) return;

	// creating fixed panels, repainting them to be sure that everything
	// is OK
	createCompareTable(origTable);
	var stickyCol = $('.compare-outer-wrapper').find('.clone.column');
	var stickyHead = $('.compare-outer-wrapper').find('.clone.header');
	var stickyIntersection = $('.compare-outer-wrapper').find('.intersection');
	repaintSticky(origTable, stickyCol, stickyHead, stickyIntersection);
	checkTop($('.compare-table.clone.header'), origTable);

	$('.compare-inner-wrapper').mCustomScrollbar({
		axis: 'x',
		contentTouchScroll: 100,
		mouseWheel: { enable: false }
	});

	// dynamically adding circles and lines to horizontal scrollbar dragger
	// we can't do it via HTML or on server, because the markup of custom
	// scrollbar itself is created dynamically
	$('.mCSB_horizontal .mCSB_dragger_bar').append('<div class="h-scrollbar-circle left"></div>');
	$('.mCSB_horizontal .mCSB_dragger_bar').append('<div class="h-scrollbar-circle right"></div>');
	$('.mCSB_horizontal .mCSB_dragger_bar').append('<div class="h-scrollbar-lines-container"></div>');
	$('.h-scrollbar-lines-container').append('<div class="v-line vl1" />');
	$('.h-scrollbar-lines-container').append('<div class="v-line vl2" />');
	$('.h-scrollbar-lines-container').append('<div class="v-line vl3" />');
	$('.h-scrollbar-lines-container').append('<div class="v-line vl4" />');

	//move stylized scrollbar to top part of table
	var firstColWidth = $('#compare-table').find('thead th:first-child').outerWidth();
	$('.compare-inner-wrapper .mCSB_scrollTools.mCSB_scrollTools_horizontal').offset({ top: $('.compare-table').find('.spacer').offset().top+1 }).css('left', firstColWidth+2);

	// selecting columns (for further dragging)
	var column;
	$('#compare-table td, #compare-table>thead th, .clone.header th').hover(function(){
		var colNumber = $(this).index()+1;
		column = $('#compare-table td:nth-child('+colNumber+'), .clone.header th:nth-child('+colNumber+'), #compare-table>thead th:nth-child('+colNumber+')');
		column.addClass('hovered');
	}, function(){
		if (column) column.removeClass('hovered');
	})

	$(window).scroll(function(){
		checkTop($('.compare-table.clone.header'), origTable);
	});

	$(window).resize(function(){
		checkTop($('.compare-table.clone.header'), origTable);
	});

	setInterval(function(){
		// there are some rendering bugs without this repaint.
		repaintSticky(origTable, stickyCol, stickyHead, stickyIntersection);
	}, 500);
})
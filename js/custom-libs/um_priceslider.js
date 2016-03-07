"use strict";

$( document ).ready(function(){
	var minPriceLimit = 0;
	var maxPriceLimit = 100000;
	$('#price-range-slider').noUiSlider({
		start: [20000, 80000],
		connect: true,
		behaviour: 'snap',
		step: 1,
		range: {
			'min': minPriceLimit,
			'max': maxPriceLimit
		}
	});
	$("#price-range-slider").Link('lower').to($('#min-price'));

	$("#price-range-slider").Link('upper').to($('#max-price'));

	$('.slider-tooltip').on('click', function(){
		$(this).find('input').focus().select();
	})

	
	// binding to document because inputs in tooltips are created and constantly recreated
	// dynamically by noUiSlider
	$(document).on('change', '#min-price-new, #max-price-new', function(){
		
		// checking what input was changed of the two
		// and saving old value, getting it from outer (linked) input
		var mode = 'min';
		var oldVal = $('#min-price').val();
		if ($(this).is('#max-price-new')){
			mode = 'max';
			oldVal = $('#max-price').val();
		}
		
		// checking whether new value is numeric
		// and resetting it if not
		var newVal = $(this).val();
		if (!$.isNumeric(newVal)) {
			$(this).val(oldVal);
			return false;
		}

		// noUiSlider cannot update its values based on inner inputs created by
		// himself (or I just didn't find how to do that), so to do that, on
		// changing values in inner inputs we need to change values accordingly in
		// outer inputs, which in turn are linked to noUiSlider as 'normal' inputs
		if (mode == 'min') {
			$('#min-price').val(newVal);
			$('#min-price').change();
		} else {
			$('#max-price').val(newVal);
			$('#max-price').change();
		}
		
	});
});
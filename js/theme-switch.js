(function(){
	"use strict";

	// getting color theme from localStorage if available
	var theme = localStorage.getItem('apparel-theme');
	if (theme){
		if (theme.indexOf('flat') !== -1) $('html').addClass('flat');
		else $('html').removeClass('flat');
		$('link.current-theme').attr('href','css/themes/theme_'+theme+'.css');
		$('.theme-demo.'+theme).addClass('active').siblings().removeClass('active');
	} else{
		// if there is no color theme in localStorage, then set default theme
		theme = "flat_purple";
		if (theme.indexOf('flat') !== -1) $('html').addClass('flat');
		else $('html').removeClass('flat');
		$('link.current-theme').attr('href','css/themes/theme_'+theme+'.css');
		$('.theme-demo.'+theme).addClass('active').siblings().removeClass('active');
	}

	$(function(){
		// color-theme switch
		$('.theme-demo').on('click', function(){
			var newTheme = $(this).attr('data-theme');
			if (theme != newTheme){
				theme = newTheme;
				$('link.current-theme').attr('href','css/themes/theme_'+theme+'.css');
				
				if (theme.indexOf('flat') !== -1) $('html').addClass('flat');
				else $('html').removeClass('flat');

				localStorage.setItem('apparel-theme', theme);
				$(this).addClass('active').siblings().removeClass('active');
			} else return;
		});
	})

})();
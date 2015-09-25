function homeScrollMenu ( e ) {
    if (jQuery('body').hasClass('front-page')){
    	e.preventDefault();
    	e.stopPropagation();
	}

    var seccion = jQuery(this).children('a').attr('href');
    var margen = jQuery('header').height();

    if (seccion === '#inicio') {
    	seccion = '#waxa-1';
	}

    jQuery('html, body').stop().animate({
        scrollTop: (jQuery(seccion).offset().top - margen)
    }, 600);
}

function removeAllActives () {
	jQuery('.header-menu-item > a').removeClass('on-air');
}

function checkScroll(){
	var ventana = jQuery(window).height();
	var actual = jQuery(window).scrollTop();
	var idActual = '#waxa-anchor-';

	if (actual < (ventana * 0.5)) {
		idActual += '1';
	} else if (actual < (ventana * 1.5)) {
		idActual += '2';
	} else if (actual < (ventana * 2.5)) {
		idActual += '3';
	} else {
		idActual += '4';
	}

	if (! jQuery(idActual).hasClass('on-air')){
		removeAllActives();
	}
	jQuery(idActual).addClass('on-air');
}

function calcularClipImg () {
	var ancho = jQuery(window).width();
	var alto = jQuery(window).height() - jQuery('header').height();
	var img = jQuery('img.attachment-post-thumbnail.wp-post-image');
	var rec = [0,0,0,0];
	var sobrante = 0;
	if ( img.height() > alto ){
		sobrante = (img.height() - alto) / 2;
	}

	var output = 'rect(' + sobrante +',' + ancho + ',' + (sobrante + alto) + ',0)'; 
	console.log(output);
	return output;
}

jQuery(document).ready(function () {
	var alturaWindow = jQuery(window).height();
	var alturaHeader = jQuery('header').height();

	if ( jQuery('body').hasClass('front-page') ){
		jQuery('.waxa-container').css('min-height', (alturaWindow - alturaHeader + 'px'));
	}
	jQuery('.brook').css('min-height', (alturaWindow - alturaHeader + 'px'));
	jQuery('.waxa-container:first-of-type').css('margin-top', (alturaHeader + 'px'));
	jQuery('.dibujo-container').height(jQuery('.dibujo-container').width());
	jQuery('.info-container').height(jQuery('.dibujo').width());
	jQuery('.titulo').on('click', homeScrollMenu);
	jQuery('.header-menu-item').on('click', homeScrollMenu);
	jQuery('.menu').height(alturaHeader);	
	jQuery('.menu-drop').height(alturaHeader);
	jQuery(document).scroll(checkScroll);
	checkScroll();
  	console.log("document ready");
});
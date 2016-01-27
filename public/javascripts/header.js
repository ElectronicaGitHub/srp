$(function () {

	var slides = conf().slides,
    	duration = 300;

	$('#js-menu-init').on('mouseover', function (e) {
		e.preventDefault();
		$('header').addClass('dropped');
	});
	$('#js-menu-init').on('mouseleave', function (e) {
		e.preventDefault();
		$('header').removeClass('dropped');
	});

    $('.menu .image').css({
		'background-image' : 'url(' + slides[0].src + ')'
	});

 	$('.menu ul li').hover(function () {
 		$('.last').removeClass('last');
 		var index = $(this).index() % slides.length,
 			self = this, slide = $(self).closest('.menu').find('*[class*=-slide]');

 		var img = $('<div/>').addClass('image').css({
 			'background-image' : 'url(' + slides[index].src + ')',
 			opacity : 0
 		}).appendTo('.image-wrapper');
 		img.animate({
 			opacity : 1
 		}, duration)
 			.addClass('last');

		setTimeout(function () {
	 		$('header .image').not('.last').remove();
		}, duration);
 	});
});
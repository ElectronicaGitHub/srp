$(function () {

	var hotel = window.hotel,
		coords = window.hotel.coordinates,
		map,
		points = [],
		current_image = 0;

	if ($('.image-panel').hasClass('single-image')) return;

	$('.right-button').on('click', function (e) {
		current_image = current_image + 1 > hotel.images.length - 1 ? 0 : current_image + 1;
		change(current_image, $('.image-radio').eq(current_image));
	});
	$('.left-button').on('click', function (e) {
		current_image = current_image - 1 < 0 ? hotel.images.length - 1 : current_image - 1;
		change(current_image, $('.image-radio').eq(current_image));
	});

	$('.image-radio').on('click', function (e) {
		current_image = parseInt($(this).attr('data-n'), 10);
		change(current_image, $(this));
	});

	function change (n, radioButton) {
		console.log(current_image);

		var next = $('.images-wrapper').find('[data-n=' + n + ']');
		var current = $('.images-wrapper .current');
		
		next.addClass('pre_current');
		next.animate({
			opacity : 1
		}, 300, function () {
			next.removeClass('pre_current').addClass('current').css({ opacity : ''});
			current.removeClass('current');
		});
		$('.image-radio').removeClass('current');
		radioButton.addClass('current');
	}
});
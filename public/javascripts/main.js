$(function () {

	$('.image-radio').on('click', function (e) {

		e.preventDefault();

		var n = $(this).attr('data-n');

		var parent = $(this).closest('.cell-wrapper');

		var next = parent.find('.images-wrapper').find('[data-n=' + n + ']');
		var current = parent.find('.images-wrapper .current');

		next.addClass('pre_current');
		next.animate({
			opacity : 1
		}, 300, function () {
			next.removeClass('pre_current').addClass('current').css({ opacity : ''});
			current.removeClass('current');
		});
		parent.find('.image-radio').removeClass('current');
		$(this).addClass('current');
	});

});
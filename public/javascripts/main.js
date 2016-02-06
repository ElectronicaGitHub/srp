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



	$('#search-button').on('click', function () {
		var obj = {};
		$('.filters-wrapper .dropdown').each(function (n, el) {
			var el = $(el);
			obj[$(el).attr('data-type')] = el.find('.selected[data-id]').attr('data-id');

		});

		$.ajax({
			method : 'POST',
			url : '/api/getHotels',
			data : obj,
			success : function (data) {
				$('.filters-content .content').html('');
				$('.filters-content .content').html($('#cells').render(data.hotels));
				setTimeout(function () {
					$('.images-with-radio-wrapper').each(function (n, el) {
						el = $(el);
						el.find('.images-wrapper .card-image').first().addClass('current');
						if (el.find('.radio-wrapper span').length > 1) {
							el.find('.radio-wrapper span').first().addClass('current');
						} else {
							el.find('.radio-wrapper').remove();
						}
					});
				})

			},
			error : function (data) {
				console.log('err', data);
			}
		});
	})

});
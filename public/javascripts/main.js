$(function () {

	$('.city-carousel').owlCarousel({
	    loop: true,
	    margin: 0,
	    autoplay : true,
	    autoplayTimeout: 4000,
	    autoplayHoverPause: true,
	    responsive: {
	        0: {
	            items: 1
	        },
	        600: {
	            items: 2
	        },
	        1000: {
	            items: 2
	        }
	    }
	});

	$(document).on('click', '.image-radio', function (e) {

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

	var SEARCH_OBJ = window.query, PAGE = 1, LOADING = false, NO_MORE_DATA = false;

	$('#search-button').on('click', function () {
		SEARCH_OBJ = {};
		$('.filters-wrapper .dropdown').each(function (n, _el) {
			var el = $(_el);
			var val = el.find('.selected[data-id]').attr('data-id');
			if (val) {
				SEARCH_OBJ[$(el).attr('data-type')] = val;
			}
		});

		PAGE = 0;
		NO_MORE_DATA = false;
		if (!$(this).hasClass('index')) {
			getData();
		} else {
			window.location = '/hotels?' + $.param(SEARCH_OBJ);
		}
	});

	function getData(append) {
		if (LOADING || NO_MORE_DATA) return;
		LOADING = true;
		$.ajax({
			method : 'POST',
			url : '/api/getHotels?p=' + PAGE,
			data : SEARCH_OBJ,
			success : function (data) {
				if (data.hotels.length < 10) {
					NO_MORE_DATA = true;
				}
				if (!append) {
					$('.filters-content .content').html('');
					$('.filters-content .content').html($('#cells').render(data.hotels));
				} else {
					$('.filters-content .content').append($('#cells').render(data.hotels));
				}
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
					LOADING = false;
					PAGE++;
				});

			},
			error : function (data) {
				console.log('err', data);
			}
		});
	}

	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() > $(document).height() - 800) {
			getData(true);
		}
	});

});
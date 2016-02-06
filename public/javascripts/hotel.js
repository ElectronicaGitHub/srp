$(function () {

	$('.image-radio').on('click', function () {
		var n = $(this).attr('data-n');

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
		$(this).addClass('current');
	});

	var coords = window.hotel.coordinates, map;
	ymaps.ready(function () {
		map = new ymaps.Map("map", {
	        center: coords, 
	        zoom: 10,
	        type : 'yandex#map',
	        controls : []
	    });
	    setTimeout(function () {
		    map.behaviors.disable('scrollZoom').disable('drag');
	    })
		myPlacemark = new ymaps.Placemark(coords, {}, {
	    	preset: 'islands#icon',
	        iconColor: '#E82C0C'
	    });	
	    map.geoObjects.add(myPlacemark);
		
	});

	$('#picker').dateRangePicker({
		inline: true,
		container: '#picker', 
		alwaysOpen: true,
		startDate: moment().format('DD.MM.YYYY'),
		format: 'DD.MM.YYYY',
		getValue: function() {
			return $(this).val();
		},
	}).bind('datepicker-first-date-selected', function(event, obj) {
		a = moment(obj.date1).locale('ru').format('D MMMM YYYY');
	}).bind('datepicker-change',function(event,obj) {
		days = dateDiffInDays(obj.date1, obj.date2) + 1;
		price = hotel.price[0];
		if (days > 3) price = hotel.price[0];
		if (days > 4 && days <= 6 ) price = hotel.price[1];
		if (days > 6 && days <= 10) price = hotel.price[2];
		if (days > 10) price = hotel.price[3];

		$('.price-container .price').text(days * price);
		if (!$('.offer-continue').is(':visible')) {
			$('.offer-continue').slideToggle(300);
		}
	})

	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	// a and b are javascript Date objects
	function dateDiffInDays(a, b) {
	  // Discard the time and time-zone information.
	  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}

})
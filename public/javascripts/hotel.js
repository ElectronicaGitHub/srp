$(function () {

	var hotel = window.hotel,
		coords = window.hotel.coordinates,
		map,
		priceForPerson,
		lsPrefix = 'srp__req__';

	ymaps.ready(function () {
		map = new ymaps.Map("map", {
			center: coords,
			zoom: 10,
			type : 'yandex#map',
			controls : []
		});
		myPlacemark = new ymaps.Placemark(coords, {}, {
			preset: 'islands#icon',
			iconColor: '#F34352'
		});
		map.geoObjects.add(myPlacemark);

		for (var i in hotel.places) {
			(function (place) {
				mp = new ymaps.Placemark(place.coordinates, {
					hintContent : place.title
				}, {
					preset: 'islands#icon',
					iconColor: '#FBB958'
				});
				mp.events.add('click', function () {
					window.open('/place/'+ place.title_url);
				});
				map.geoObjects.add(mp);
			})(hotel.places[i]);
		}

		map.setBounds(map.geoObjects.getBounds());
	});

	$("#phone").mask("+9 (999) 999 99 99");

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
	}).bind('datepicker-change',function(event, obj) {

		days = dateDiffInDays(obj.date1, obj.date2) + 1;
		price = hotel.price[0];
		if (days > 3) price = hotel.price[0];
		if (days > 4 && days <= 6 ) price = hotel.price[1];
		if (days > 6 && days <= 10) price = hotel.price[2];
		if (days > 10) price = hotel.price[3];

		$('form #dates').val(obj.value);
		$('form #price').val(days * price);

		$('form .price').text(days * price);
		if (!$('.offer-continue').is(':visible')) {
			$('.offer-continue').slideToggle(300);
		}

		priceForPerson = days * price;
	});

	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	function dateDiffInDays(a, b) {
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}

	$(document).on('click', '#offer-button', function (e) {
		var btn = $(this);
		e.preventDefault();
		var data = btn.closest('form').serialize();

		btn.html('<i class="fa fa-spinner fa-spin"></i>');

		$.post('/create_offer', data, function (err, ok) {
			console.log(err, ok);
			localStorage.setItem(lsPrefix + hotel._id, 1);
			btn.attr('disabled', true);
			ga('send', 'event', 'request', 'call_request');
			btn.text('Ваш заказ сформирован, в течение 15 минут мы свяжемся с вами для подтверждения заказа');
		});
	});

	$(document).on('change keyup', '#count', function (e) {
		var lp = $('form #price').val();
		var c = $(this).val();

		var np = priceForPerson * c;

		$('form #price').val(np);
		$('form .price').text(np);
	});

});
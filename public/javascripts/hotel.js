$(function () {

	var hotel = window.hotel,
		coords = window.hotel.coordinates,
		map;

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
			mp = new ymaps.Placemark(hotel.places[i].coordinates, {}, {
				preset: 'islands#icon',
				iconColor: '#FBB958'
			});
			map.geoObjects.add(mp);
		}

		map.setBounds(map.geoObjects.getBounds());
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
	});

	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	function dateDiffInDays(a, b) {
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}

});
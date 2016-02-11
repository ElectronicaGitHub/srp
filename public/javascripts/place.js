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

	});

});
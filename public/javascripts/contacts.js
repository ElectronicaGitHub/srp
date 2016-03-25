$(function () {
	var coords = [55.745396777228905,37.58994050000001];
	ymaps.ready(function () {
		map = new ymaps.Map("map", {
			center: coords,
			zoom: 16,
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
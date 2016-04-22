var hotel = window.hotel,
	coords = window.hotel.coordinates,
	map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: coords[0], 
			lng: coords[1]
		},
		zoom: 11
	});

	var marker = new google.maps.Marker({
		position: {
			lat: coords[0], 
			lng: coords[1]
		},
		map: map,
		zIndex : 20,		
		title: 'Hello World!'
	});

}
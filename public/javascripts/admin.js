angular.module('serpAdmin', []).controller('MainCtrl', [ '$scope', '$http', function ($scope, $http) {

	$scope.restplace = {};
	var map;
	
	ymaps.ready(mapInit);

	function mapInit() {
	 	map = new ymaps.Map("map", {
	        center: [55.76, 37.64], 
	        zoom: 7
	    });
	    map.events.add('click', function (e) {

	    	map.geoObjects.removeAll();

		    var coords = e.get('coords');

		    myPlacemark = new ymaps.Placemark(coords, {}, {
		    	preset: 'islands#icon',
	            iconColor: '#E82C0C'
		    });	
		    map.geoObjects.add(myPlacemark);

		    // Отправим запрос на геокодирование.
            var names = [];
            ymaps.geocode(coords).then(function (res) {
                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('name'));

		            $scope.restplace.adress = names.reverse().join(', ');
				    $scope.$apply();
                });
            });
 
		    $scope.restplace.coordinates = coords;
		});
	}

	$scope.imageLoad = function () {
		$('#image').click();
	}

	$('#image').on('change', function (e) {

		var data = new FormData();

		for (var i in e.target.files) {
			data.append('file' + i, e.target.files[i]);
		}

		$http.post('/admin/loadImages', data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined }
		})
			.success(function (data) {
				console.log(data);
				$scope.imageList = data.filesArray;
			})
			.error(function (data) {
				console.log(data);
			})
	})

	$scope.saveRestPlace = function (place) {
		place.images = $scope.imageList.map(function (el) { return el._id; });

		$http.post('/admin/place', place)
			.success(function (data) {
				console.log(data);
			})
			.error(function (data) {
				console.log(data);
			})
	}


} ])
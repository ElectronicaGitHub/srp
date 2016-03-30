angular.module('serpAdmin', []).controller('MainCtrl', [ '$scope', '$http', function ($scope, $http) {

	$scope.restplace = window.hotel || {};

	$scope.restplace._benefits = window.benefits;
	$scope.restplace._tags = window.tags;
	$scope.restplace._places = window.places;
	
	if (window.hotel) {
		$scope.images = $scope.restplace.images;
		$scope.mini_images = $scope.restplace.mini_images;

		$scope.restplace._places = $scope.restplace._places.map(function (el) {
			if ($scope.restplace.places.indexOf(el._id) != -1) {
				el.selected = true;
			}
			return el;
		});

		$scope.restplace._tags = $scope.restplace._tags.map(function (el) {
			if ($scope.restplace.tags.indexOf(el._id) != -1) {
				el.value = true;
			}
			return el;
		});

		$scope.restplace._benefits = $scope.restplace._benefits.map(function (el) {
			if ($scope.restplace.benefits.indexOf(el._id) != -1) {
				el.value = true;
			}
			return el;
		});

		for (var i = 1; i < 5; i++) {
			$scope.restplace['price' + i] = $scope.restplace.price[i - 1];
		}
	}
	
	$scope._price_categories = [
		{ _id : 0, name : 'до 3000'},
		{ _id : 1, name : 'от 3000 до 6000'},
		{ _id : 2, name : 'от 6000'}
	];

	$scope._cities = window.cities;

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

                    namesr = names.reverse();

		            $scope.restplace.adress = namesr.join(', ');
		            $scope.restplace.country = namesr[0];
		            // $scope.restplace.city = namesr[1];
				    $scope.$apply();
                });
            });
 
		    $scope.restplace.coordinates = coords;
		});
	}

	$scope.removeImage = function (imgId, placeId, index) {
		if (!placeId) {
			$scope.images.splice(index, 1);
		} else {
			$http.delete('/admin/image/' + imgId)
			.success(function (data) {
				console.log(data);
				$scope.images.splice(index, 1);
			})
			.error(function (data) {
				console.log(data);
			});
		}
	};

	$scope.imageLoad = function (bool) {
		if (bool) {
			$('#image').click();
		} else {
			$('#mini-image').click();
		}
	}

	$('#image, #mini-image').on('change', function (e) {
		var key = $(this).attr('data-key');
		var data = new FormData();

		for (var i in e.target.files) {
			data.append('file' + i, e.target.files[i]);
		}

		$http.post('/admin/loadImages', data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined }
		})
			.success(function (data) {
				$scope[key] = $scope[key] || [];
				$scope[key] = $scope[key].concat(data.filesArray);
				console.log(data);
			})
			.error(function (data) {
				console.log(data);
			});
	});

	$scope.saveRestPlace = function (place) {
		post(place, '/admin/restplace');
	};

	$scope.updateRestPlace = function (place) {
		post(place, '/admin/restplace/' + place._id);
	};

	function post(place, url) {

		place.images = $scope.images.map(function (el) { return el._id; });

		place.benefits = place._benefits.filter(function (el) { return el.value; }).map(function (el) {
			return el._id;
		});
		place.tags = place._tags.filter(function (el) { return el.value; }).map(function (el) {
			return el._id;
		});
		place.places = place._places.filter(function (el) { return el.selected; }).map(function (el) {
			return el._id;
		});

		place.price = [];
		for (var i = 1; i < 5; i++) {
			place.price.push(place['price' + i]);
		}

		$http.post(url, place)
		.success(function (data) {
			console.log(data);
			window.location = '/admin';
		})
		.error(function (data) {
			console.log(data);
		});

	}
}]);
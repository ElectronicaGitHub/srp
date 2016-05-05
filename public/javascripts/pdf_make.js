angular.module('app', ['ui.tinymce']).controller('pdfMake', ['$scope', '$http', function ($scope, $http) {
	console.log('hello');
	$scope.request = window.request;

	imagesN = 0;

	$scope.html1 = '';

	$scope.options = {
		height: '700px',
		content_css : '/stylesheets/builded/vaucher.css'
	};

	$scope.html1 += '<div class="main-container" style="background-image: url(/../assets/vaucher_bg.png); width: 100%; background-position: center; background-size: 100%">';

		$scope.html1 += '<h1 style="text-align:center">Отель</h1>';
		$scope.html1 += '<div class="iterable"><img style="width: 40%; float:left" src="/..' + $scope.request.hotel.images[0].path_low +  '"/><p class="text">' + $scope.request.hotel.description_full + '</p></div> ';
		$scope.html1 += '<h1 style="text-align:center">Места</h1>';

		for (var i in $scope.request.hotel.places) {
			$scope.html1 += '<div class="iterable"><img style="width: 40%; ' + (i % 2 == 1 ? 'float:left' : 'float:right') + '" src="/..' + $scope.request.hotel.places[i].images[0].path_low +  '"/>';
			$scope.html1 += '<p class="text">' + $scope.request.hotel.places[i].description_full + '</p></div>'
		};


	$scope.html1 += '</div>';

	$scope.post = function () {
		$scope.html1 += '<link rel="stylesheet" href="/../stylesheets/builded/vaucher.css"/>';

		$http.post('/rq/create_pdf/' + $scope.request._id, { html : $scope.html1 })
		.success(function (data) {
			console.log(data);

			$scope.pdf = data.pdf;

			console.log($scope.pdf);
		})
		.error(function (data) {
			console.log(data);
		});
	}

}]);
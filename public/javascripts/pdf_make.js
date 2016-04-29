angular.module('app', ['ui.tinymce']).controller('pdfMake', ['$scope', '$http', function ($scope, $http) {
	console.log('hello');
	$scope.request = window.request;

	imagesN = 0;

	$scope.html1 = '';
	$scope.html1 += '<link rel="stylesheet" href="/../stylesheets/builded/vaucher.css">';

	$scope.options = {
		height: '700px'
	};

	var cont = $('<div/>').css({
		'background-image' : 'url(/../assets/vaucher_bg.jpg)',
		height: '100%',
		overflow: 'hidden',
		'background-position' : 'center',
		'background-size' : 'cover'
	});

	inner = '<h1 style="text-align:center">Отель</h1>';
	inner += '<div style="height: 300px"><img width="300" height="250" src="/..' + $scope.request.hotel.images[0].path_low +  '"/></div> ';
	inner += '</div><h1 style="text-align:center">Места</h1><div>';

	for (var i in $scope.request.hotel.places) {
		inner += '<div style="' + (i % 2 == 1 ? 'float:left' : 'float:right') + ';height: 300px" ><img width="250" height="200" src="/..' + $scope.request.hotel.places[i].images[0].path_low +  '"/></div> ';
		inner += '<p>' + $scope.request.hotel.places[i].description_full + '</p>'
	};
	console.log(cont, inner);
	cont.html(inner);
	$scope.html1 += cont[0].outerHTML;
	$scope.html1 += cont[0].outerHTML;
	$scope.html1 += cont[0].outerHTML;


	$scope.addImage = function () {
		$scope.html1 += '<div style="height: 300px" ><img width="250" height="200" src="/..' + $scope.request.hotel.images[imagesN].path_low +  '"/></div> ';
		imagesN++;
	}

	$scope.post = function () {
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
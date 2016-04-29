angular.module('app', ['ui.tinymce']).controller('pdfMake', ['$scope', '$http', function($scope, $http) {
	console.log('hello');
	$scope.request = window.request;
	$scope.html1 = '<b>HELLO</b>';

	imagesN = 0;

	$scope.options = {
		height: '700px'
	};

	$scope.addImage = function () {
		// $scope.html1 += '<img width="300" height="250" src="file:///Users/philip/work/serpantin/public' + $scope.request.hotel.images[imagesN].path_low +  '"/> ' + $scope.request.hotel.images[imagesN].path_low + '!!!';
		$scope.html1 += '<img width="300" height="250" src="/..' + $scope.request.hotel.images[imagesN].path_low +  '"/> ' + $scope.request.hotel.images[imagesN].path_low + '!!!';
		imagesN++;
	}

	$scope.post = function () {
		$http.post('/rq/create_pdf', { html : $scope.html1 })
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			console.log(data);
		});
	}

}]);
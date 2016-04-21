angular.module('app', []).controller('cabinet', ['$scope', '$http', function ($scope, $http) {
	$scope.requests = window.requests;

	$scope.makeLink = function (request) {
		$http.post('/payment/link', { 
			id : request._id, 
			sum : request.final_price 
		})
		.success(function (data) {
			console.log(data);
			console.log(data.link.SignatureValue);
			var link = data.base + '?' + $.param(data.link);
			console.log(link);
		})
		.error(function (data) {
			console.log(data);
		});
	}

}]);
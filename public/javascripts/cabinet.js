angular.module('app', []).controller('cabinet', ['$scope', '$http', function ($scope, $http) {
	$scope.requests = window.requests;

	$scope.makeLink = function (request) {
		$http.post('/payment/link', { 
			id : request._id, 
			sum : request.final_price,
			invId : request.inv_id
		})
		.success(function (data) {
			// console.log(data);
			// console.log(data.link.SignatureValue);
			var link = data.base + '?' + $.param(data.link);
			// console.log(link);
			location.href = link;
		})
		.error(function (data) {
			console.log(data);
		});
	}

}]);
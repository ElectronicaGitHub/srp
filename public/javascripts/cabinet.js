angular.module('app', []).controller('cabinet', ['$scope', '$http', function ($scope, $http) {
	$scope.requests = window.requests;

	$scope.requestPay = function (request) {
		$http.post('/rq/rpay/' + request._id, request)
		.success(function (data) {
			console.log(data);
			request.status = 2;
		})
		.error(function (data) {
			console.log(data);
		});
	};

}]);
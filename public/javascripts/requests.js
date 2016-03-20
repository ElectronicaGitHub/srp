angular.module('app', []).controller('reqs', ['$scope', '$http', function ($scope, $http) {
	$scope.requests = window.requests;

	$scope.updateReq = function (request, obj) {

		if (obj.final_price) {
			obj.final_price = Math.floor(obj.final_price);
		}

		console.log(obj);
		$http.post('/rq/r/' + request._id, obj)
		.success(function (data) {
			console.log(data);
			angular.extend(request, obj);
		})
		.error(function (data) {
			console.log(data);
		});
	};
}]);
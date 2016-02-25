angular.module('serpAdmin', ['textAngular']).controller('MainCtrl', [ '$scope', '$http', function ($scope, $http) {

	$scope.post = window.post;

	$scope.savePost = function (post) {
		send(post, '/admin/post');
	}

	$scope.updatePost = function (post) {
		send(post, '/admin/post/' + post._id);
	}

	function send(post, url) {
		$http.post(url, post)
			.success(function (data) {
				console.log(data);
				window.location = '/admin';
			})
			.error(function (data) {
				console.log(data);
			});
	}

}]);
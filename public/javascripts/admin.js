angular.module('serpAdmin', ['ui.bootstrap'], function ($httpProvider, $provide) {
	$provide.factory('myHttpInterceptor', function($q) {
	    return {
	      'request': function(config) {
	        return config;
	      },
	     'requestError': function(rejection) {
	        if (canRecover(rejection)) {
	          return responseOrNewPromise
	        }
	        return $q.reject(rejection);
	      },
	      'response': function(response) {
	        // do something on success
	        if (typeof response.data != 'string') {
		        $('.admin_hint').show();
	        	setTimeout(function () {
		        	$('.admin_hint').hide();
	        	}, 1000);
	        }
	        return response;
	      }
	    };
	  });

    $httpProvider.interceptors.push('myHttpInterceptor');
}).controller('MainCtrl', [ '$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {

	$scope.tags = window.tags;
	$scope.benefits = window.benefits;
	$scope.cities = window.cities;
	$scope.places = window.places;
	$scope.restplaces = window.restplaces;
	$scope.posts = window.posts;

	$scope.newBenefit = {};
	$scope.newTag = {};
	$scope.newCity = {};

	$scope.createCity = function () {
		$scope.newCity.image = $scope.newCity.image._id;
		$http.post('/admin/city', $scope.newCity)
			.success(function (data) {
				console.log(data);
				$scope.cities.push($scope.newCity);
				$scope.newCity = {};
			})
			.error(function (data) {
				console.log(data);
			});
	};

	$scope.createTag = function () {
		$scope.newTag.image = $scope.newTag.image._id;
		$http.post('/admin/tag', $scope.newTag)
			.success(function (data) {
				console.log(data);
				$scope.tags.push($scope.newTag);
				$scope.newTag = {};
			})
			.error(function (data) {
				console.log(data);
			});
	};

	$scope.updateCity = function (city) {
		$scope.newCity = city || $scope.newCity;
		if ($scope.newCity.image) {
			$scope.newCity.image = $scope.newCity.image._id;
		}
		$http.post('/admin/city/' + $scope.newCity._id, $scope.newCity)
			.success(function (data) {
				console.log(data);
				$scope.newCity = {};
			})
			.error(function (data) {
				console.log(data);
			});
	};

	$scope.updateTag = function (tag) {
		$scope.newTag = tag || $scope.newTag;
		if ($scope.newTag.image) {
			$scope.newTag.image = $scope.newTag.image._id;
		}
		$http.post('/admin/tag/' + $scope.newTag._id, $scope.newTag)
			.success(function (data) {
				console.log(data);
				$scope.newTag = {};
			})
			.error(function (data) {
				console.log(data);
			});
	};

	$scope.preloadCity = function (city) {
		$scope.newCity = city;
		$scope.newCity.updated = true;
	};
	$scope.preloadTag = function (tag) {
		$scope.newTag = tag;
		$scope.newTag.updated = true;
	};

	$scope.createBenefit = function () {
		$scope.newBenefit.image = $scope.newBenefit.image._id;
		$http.post('/admin/benefit', $scope.newBenefit)
			.success(function (data) {
				console.log(data);
				$scope.benefits.push($scope.newBenefit);
				$scope.newBenefit = {};
			})
			.error(function (data) {
				console.log(data);
			});
	};

	$scope.loadImageForTag = function () {
		$('#image_tag').click();
	};

	$scope.loadImageForCity = function () {
		$('#image_city').click();
	};

	$('#image_tag').on('change', function (e) {
		var data = new FormData();

		for (var i in e.target.files) {
			data.append('file' + i, e.target.files[i]);
		}

		$http.post('/admin/loadImages', data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined }
		})
			.success(function (data) {
				$scope.newTag.image = data.filesArray[0];
				console.log(data);
			})
			.error(function (data) {
				console.log(data);
			});
	});

	$('#image_city').on('change', function (e) {
		var data = new FormData();

		for (var i in e.target.files) {
			data.append('file' + i, e.target.files[i]);
		}

		$http.post('/admin/loadImages', data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined }
		})
			.success(function (data) {
				$scope.newCity.image = data.filesArray[0];
				console.log(data);
			})
			.error(function (data) {
				console.log(data);
			});
	});

	$scope.loadImageForBenefit = function () {
		$('#image').click();
	};

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
				$scope.newBenefit.image = data.filesArray[0];
				console.log(data);
			})
			.error(function (data) {
				console.log(data);
			});
	});

	$scope.removeIndex = null;
	$scope.iterateModel = null;

	$scope.delete = function (name, model) {

		$http.delete('/admin/' + name + '/' + model._id)
		.success(function (data) {
			console.log(data);
			// $scope[$scope.iterateModel].splice($scope.removeIndex, 1);
			for (var i in $scope[$scope.iterateModel]) {
				if ($scope[$scope.iterateModel][i]._id == model._id) {
					$scope[$scope.iterateModel].splice(i, 1);
				}
			}
			
		})
		.error(function (data) {
			console.log(data);
		});
	};

	$scope.restore = function (type, model) {
		$http.post('/admin/restore/' + type + '/' + model._id)
		.success(function (data) {
			model.deleted = false;
		});
	};

	$scope.deleteModal = function (name, model, removeIndex, iterateModel) {
		$scope.removeIndex = removeIndex;
		$scope.iterateModel = iterateModel;
		var modalInstance = $uibModal.open({
			templateUrl: 'deleteModel.html',
			controller: 'deleteModalCtrl',
			resolve: {
				items: function () {
					return {name : name, model : model};
				}
			}
		});
		modalInstance.result.then(function (obj) {
			$scope.delete(name, model);
			// console.log(obj.name, obj.model);
		}, function () {
		});
	};


}])
.controller('deleteModalCtrl', function ($scope, $uibModalInstance, items) {

	$scope.items = items;

	$scope.ok = function () {
		$uibModalInstance.close(items);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

angular.module('serpAdmin', ['ui.bootstrap']).controller('MainCtrl', [ '$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {

	$scope.tags = window.tags;
	$scope.benefits = window.benefits;
	$scope.cities = window.cities;
	$scope.places = window.places;
	$scope.restplaces = window.restplaces;

	$scope.newBenefit = {};
	$scope.newTag = {};
	$scope.newCity = {};

	$scope.createCity = function () {
		$http.post('/admin/city', $scope.newCity)
			.success(function (data) {
				console.log(data);
				$scope.cities.push($scope.newCity);
				$scope.newCity = {};
			})
			.error(function (data) {
				console.log(data);
			})
	}

	$scope.createTag = function () {
		$http.post('/admin/tag', $scope.newTag)
			.success(function (data) {
				console.log(data);
				$scope.tags.push($scope.newTag);
				$scope.newTag = {};
			})
			.error(function (data) {
				console.log(data);
			})
	}

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
			$scope[$scope.iterateModel].splice($scope.removeIndex, 1);
		})
		.error(function (data) {
			console.log(data);
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

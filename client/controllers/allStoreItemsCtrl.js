var app = angular.module("ecommerce");

app.controller("allStoreItemsCtrl", ["$scope","requests", "$location", function($scope, requests, $location){
	$scope.allItems = [];
	$scope.categories = [];
	$scope.currentCategory = $location.search().category;
	

	var init = function(){
		var params = $location.search();

		requests.getCategories().then(function(res){
			$scope.categories = res.data;
			console.log($scope.categories)
		},
		function(err){
			alert(err);
		});

		requests.getAllItems(params).then(function(res){
			$scope.allItems = res.data;
		},
		function(err){
			alert(err);
		});
	}
	init();


	$scope.isActive = function(category){
		return category === $scope.currentCategory;
	}
}]);	
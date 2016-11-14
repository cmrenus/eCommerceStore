var app = angular.module("ecommerce");

app.controller("storeItemCtrl", ["$scope", "requests", '$routeParams', function($scope, requests, $routeParams){
	$scope.item = {};
	$scope.categories = [];

	requests.getItemDetails($routeParams.sku).then(function(res){
		$scope.item = res.data;
	},
	function(err){
		alert(err);
	});
	requests.getCategories().then(function(res){
		$scope.categories = res.data;
		console.log($scope.categories)
	},
	function(err){
		alert(err);
	});

}]);
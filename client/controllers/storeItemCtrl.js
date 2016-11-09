var app = angular.module("ecommerce");

app.controller("storeItemCtrl", ["$scope", "requests", '$routeParams', function($scope, requests, $routeParams){
	$scope.item = {};

	requests.getItemDetails($routeParams.sku).then(function(res){
		$scope.item = res.data;
	},
	function(err){
		alert(err);
	});

}]);
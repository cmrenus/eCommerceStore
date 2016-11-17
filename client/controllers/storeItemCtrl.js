var app = angular.module("ecommerce");

app.controller("storeItemCtrl", ["$scope", "requests", '$routeParams','$window', function($scope, requests, $routeParams, $window){
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

	$scope.addToCart = function(sku){
		console.log("in addToCart")
		requests.addToCart(sku, 1).then(function(res){
			console.log("request");
			$window.location = '/#/cart';
			$window.location.reload();
		},
		function(err){
			console.log(err);
		});
	};

}]);
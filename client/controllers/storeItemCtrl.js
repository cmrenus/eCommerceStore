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

	requests.getItemRating($routeParams.sku).then(function(res){
		$scope.itemRating = res.data.rating;
	},
	function(err){
		console.log(err);
	});

	requests.getAllItemRatings($routeParams.sku).then(function(res){
		$scope.reviews = res.data;
	}, function(err){
		console.log(err);
	});

	$scope.addToCart = function(sku, quantity){
		console.log("in addToCart")
		requests.addToCart(sku, quantity).then(function(res){
			console.log("request");
			$window.location = '/#/cart';
			$window.location.reload();
		},
		function(err){
			console.log(err);
		});
	};

	$scope.submitRating = function(newRating){
		requests.addRating(newRating.comment, newRating.rate, $routeParams.sku, newRating.title).then(function(res){
			console.log(res);
			$scope.newRating = undefined;
			alert(res.data);
		},
		function(err){
			console.log(err);
		})
	}

}]);
var app = angular.module("ecommerce");

//controller for individual item
app.controller("storeItemCtrl", ["$scope", "requests", '$routeParams','$window', function($scope, requests, $routeParams, $window){
	$scope.item = {};
	$scope.categories = [];
	//get all information for specific item
	requests.getItemDetails($routeParams.sku).then(function(res){
		$scope.item = res.data;
	},
	function(err){
		swal("Error", err, "error")
	});

	//get all item categories for left side bar
	requests.getCategories().then(function(res){
		$scope.categories = res.data;
		console.log($scope.categories)
	},
	function(err){
		swal("Error", err, "error");
	});

	//get the average item rating
	requests.getItemRating($routeParams.sku).then(function(res){
		$scope.itemRating = res.data.rating;
	},
	function(err){
		swal("Error", err, "error")
	});

	//get all the ratings related to this item
	requests.getAllItemRatings($routeParams.sku).then(function(res){
		$scope.reviews = res.data;
	}, function(err){
		swal("Error", err, "error")
	});

	//add the item to cart and redirect to cart on success
	$scope.addToCart = function(sku, quantity){
		console.log("in addToCart")
		requests.addToCart(sku, quantity).then(function(res){
			$window.location = '/#/cart';
			$window.location.reload();
		},
		function(err){
			swal("Error", "Could not add Item to cart", "error")
		});
	};

	//submit rating
	$scope.submitRating = function(newRating){
		requests.addRating(newRating.comment, newRating.rate, $routeParams.sku, newRating.title).then(function(res){
			$scope.newRating = undefined;
			swal("Success", "Thank you for reviewing this product!", "success")
		},
		function(err){
			swal("Error", "Could not add rating. There is either an issue on our end, or you are not logged in!", "error");
		})
	}

}]);
var app = angular.module("ecommerce");

app.controller("cartCtrl", ['$scope', 'requests', '$window', function($scope, requests, $window){
	$scope.cart = [];

	requests.getCartItems().then(function(res){
		$scope.cart = res.data.cartDetails;
		$scope.quantities = res.data.cart;
		console.log(res.data);
		if(res.data.empty){
			$scope.empty = true;
		}
	},
	function(err){
		console.log(err);
	});


	$scope.removeItem = function(index){
		requests.removeCartItem($scope.cart[index].sku).then(function(res){
			$scope.totalCost = $scope.totalCost - $scope.cart[index].price;
			$scope.cart.splice(index,1);
			$window.location.reload();
		},
		function(err){
			console.log(err);
		});
	}

	$scope.updateCart = function(){
		requests.updateCart($scope.quantities).then(function(res){
			$window.location.reload();
		},
		function(err){
			console.log(err);
		});
	};

	$scope.checkout = function(){
		requests.checkout().then(function(res){
			console.log(res);
			$window.location = '/#/completedPurchase';
			$window.location.reload();
		},
		function(err){
			console.log(err);
		});
	};
}]);
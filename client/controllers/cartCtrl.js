var app = angular.module("ecommerce");

//controller for the cart
app.controller("cartCtrl", ['$scope', 'requests', '$window', function($scope, requests, $window){
	$scope.cart = [];

	//get cart items on page load
	requests.getCartItems().then(function(res){
		$scope.cart = res.data.cartDetails;
		$scope.quantities = res.data.cart;
		//if cart is empty
		if(res.data.empty){
			$scope.empty = true;
		}
	},
	function(err){
		swal("Error", "Could not retrieve cart information", "error")console.log(err);
	});

	//remove item from the cart
	$scope.removeItem = function(index){
		requests.removeCartItem($scope.cart[index].sku).then(function(res){
			//on success, reload page
			$scope.totalCost = $scope.totalCost - $scope.cart[index].price;
			$scope.cart.splice(index,1);
			$window.location.reload();
		},
		function(err){
			swal("Error", "Could not remove item from cart", "error")
			console.log(err);
		});
	}

	//update the cart
	$scope.updateCart = function(){
		requests.updateCart($scope.quantities).then(function(res){
			//on success, reload page
			$window.location.reload();
		},
		function(err){
			swal("Error", "Could not update cart", "error")
		});
	};

	//redirect to checkout page when clicked
	$scope.checkout = function(){
		$window.location = '/#/checkout';
	};

	//clear cart function
	$scope.clearCart = function(){
		requests.clearCart().then(function(res){
			//reload page if successful
			$window.location.reload();
		},
		function(err){
			swal("Error", "Could not empty your cart", "error")
		});
	};
}]);
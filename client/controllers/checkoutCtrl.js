app = angular.module("ecommerce");

app.controller('checkoutCtrl', ['$scope', 'requests','Authentication', '$window', function($scope, requests, Authentication, $window){
	$scope.user = Authentication.currentUser();
	$scope.cost = {total: 0};
	$scope.check = {};

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

	$scope.checkout = function(){
		requests.checkout($scope.user, $scope.check).then(function(res){
			$window.location = '/#/purchaseConfirmation?orderNum=' + res.data.orderNum;
		},
		function(err){
			console.log(err);
		});
	};

}]);
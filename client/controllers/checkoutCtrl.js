app = angular.module("ecommerce");
//controller for the checkout page
app.controller('checkoutCtrl', ['$scope', 'requests','Authentication', '$window', function($scope, requests, Authentication, $window){
	//initialize
	$scope.user = Authentication.currentUser();
	$scope.cost = {total: 0};
	$scope.check = {};
	//array of all states
	$scope.states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];

	//grab all cart items on page load
	requests.getCartItems().then(function(res){
		$scope.cart = res.data.cartDetails;
		$scope.quantities = res.data.cart;
		//if cart is empty, shouldnt be able to checkout
		if(res.data.empty){
			$scope.empty = true;
		}
	},
	function(err){
		swal("Error", "Could not grab cart items", "error")
	});

	//checkout
	$scope.checkout = function(){
		requests.checkout($scope.user, $scope.check).then(function(res){
			//on success, redirect to order confirmation page
			$window.location = '/#/purchaseConfirmation?orderNum=' + res.data.orderNum;
		},
		function(err){
			swal("Error", err, "error");
		});
	};

}]);
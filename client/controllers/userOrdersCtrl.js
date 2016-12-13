var app = angular.module("ecommerce");
//controller for all user orders
app.controller("userOrdersCtrl", ["$scope", "requests", function($scope, requests){
	$scope.orders = [];
	//retrieve all the orders
	requests.getOrders().then(function(res){
		console.log(res);
		$scope.orders = res.data;
	},	
	function(err){
		swal("Error", err, "error")
	})

}]);
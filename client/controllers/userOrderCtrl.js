var app = angular.module("ecommerce");

//controller for an order
app.controller("userOrderCtrl", ["$scope", "requests", "$routeParams", function($scope, requests, $routeParams){
	$scope.order = {};
	//get information for this order
	requests.getOrder($routeParams.orderNum).then(function(res){
		$scope.order = res.data;
		$scope.address = res.data.shippingAddress;
	},
	function(err){
		swal("Error", err, "error")
	});

}]);
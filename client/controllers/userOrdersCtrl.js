var app = angular.module("ecommerce");

app.controller("userOrdersCtrl", ["$scope", "requests", function($scope, requests){
	$scope.orders = [];

	requests.getOrders().then(function(res){
		console.log(res);
		$scope.orders = res.data;
	},	
	function(err){
		console.log(err);
	})

}]);
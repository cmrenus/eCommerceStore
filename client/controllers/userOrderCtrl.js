var app = angular.module("ecommerce");

app.controller("userOrderCtrl", ["$scope", "requests", "$routeParams", function($scope, requests, $routeParams){
	
	$scope.order = {};
	console.log($routeParams.orderNum);
	requests.getOrder($routeParams.orderNum).then(function(res){
		console.log(res);
		$scope.order = res.data;
	},
	function(err){
		console.log(err);
	})
}]);
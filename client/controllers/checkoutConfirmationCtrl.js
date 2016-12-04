app = angular.module("ecommerce");

app.controller("checkoutConfirmationCtrl", ["$scope", "$routeParams", function($scope, $routeParams){
	$scope.orderNum = $routeParams.orderNum;

}]);
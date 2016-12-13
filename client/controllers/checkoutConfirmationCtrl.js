app = angular.module("ecommerce");

//checkout confirmation page controller
app.controller("checkoutConfirmationCtrl", ["$scope", "$routeParams", function($scope, $routeParams){
	//set the order number based upon the URL parameters
	$scope.orderNum = $routeParams.orderNum;
}]);
var app = angular.module("ecommerce");

app.controller('indexCtrl', ['$scope', 'Authentication', function($scope, Authentication){

	$scope.isLoggedIn = Authentication.isLoggedIn;
	
	
}]);
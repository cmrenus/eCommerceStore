var app = angular.module("ecommerce");

app.controller('indexCtrl', ['$scope', 'Authentication', '$window', function($scope, Authentication, $window){

	$scope.isLoggedIn = Authentication.isLoggedIn();
	$scope.user = {};
	if($scope.isLoggedIn){
		$scope.user = Authentication.currentUser();
	}

	$scope.logout = function(){
		Authentication.logout();
		$window.location = '/#/';
		$window.location.reload();
	}
}]);
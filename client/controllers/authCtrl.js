app = angular.module("ecommerce");

app.controller("authCtrl", ['$scope', 'Authentication', '$location' , function($scope, Authentication, $location){
	$scope.user = {name: "",email: "", password: ""};

	$scope.login = function(user){
		Authentication.login(user);
	};

	$scope.register = function(user){
		Authentication.register(user);
	};
}]);
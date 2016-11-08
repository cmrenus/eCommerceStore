app = angular.module("ecommerce");

app.controller("authCtrl", ['$scope', 'Authentication', 'requests', '$window' , function($scope, Authentication, requests, $window){
	$scope.user = {name: "",email: "", password: ""};
	$scope.failedLogin = false;

	$scope.register = function(user){
		requests.register(user).then(function(res){
			Authentication.saveToken(res.data.token);
			$window.location = '/#/';
			$window.location.reload();
		},
		function(err){
			alert(err);
		});
	}

	$scope.login = function(user){
		requests.login(user).then(function(res){
			Authentication.saveToken(res.data.token);
			$window.location = '/#/';
			$window.location.reload();
		},
		function(err){
			$scope.failedLogin = true;
		});
	};
}]);
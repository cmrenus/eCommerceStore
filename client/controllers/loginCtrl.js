app = angular.module("ecommerce");

app.controller("authCtrl", ['$scope', 'authentication', '$location' , function($scope, authentication, $location){
	$scope.user = {name: "", password: ""};

	$scope.login = function(user){
		authentication.login(user).then(function(res){
			//$location.path('/#/');
			console.log(res);
		},
		function(err){
			
		});
	};

	$scope.register = function(user){
		authentication.register(user).then(function(res){
			//$location.path('/#/');
			console.log(res);
		},
		function(err){
			alert(err);
		});
	};
}]);
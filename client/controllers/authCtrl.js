app = angular.module("ecommerce");

//controller for login and registration pages
app.controller("authCtrl", ['$scope', 'Authentication', 'requests', '$window' , function($scope, Authentication, requests, $window){
	//initialize variables
	$scope.user = {name: "",email: "", password: ""};
	$scope.failedLogin = false;

	//register function
	$scope.register = function(user){
		//register request
		requests.register(user).then(function(res){
			//save JWT token and redirect on success
			Authentication.saveToken(res.data.token);
			$window.location = '/#/';
			$window.location.reload();
		},
		function(err){
			swal("Error Registering", err, "error")
		});
	}

	//login function
	$scope.login = function(user){
		requests.login(user).then(function(res){
			//save JWT Token and redirect on success
			Authentication.saveToken(res.data.token);
			$window.location = '/#/';
			$window.location.reload();
		},
		function(err){
			$scope.failedLogin = true;
		});
	};
}]);
var app = angular.module("ecommerce");

app.controller("userAccountCtrl", ["$scope", "requests", 'Authentication', function($scope, requests, Authentication){
	$scope.passwords = {};

	console.log(Authentication.currentUser());

	$scope.user = Authentication.currentUser();

	$scope.changePassword = function(passwords){
		requests.changePassword(passwords).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

	$scope.saveUserInfo = function(user){
		requests.saveUserInfo(user).then(function(res){
			console.log(res);
			Authentication.saveToken(res.data.token);
			$scope.user = Authentication.currentUser();
		},
		function(err){
			console.log(err);
		});
	};


}]);
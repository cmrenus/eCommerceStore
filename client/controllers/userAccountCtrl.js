var app = angular.module("ecommerce");

app.controller("userAccountCtrl", ["$scope", "requests", function($scope, requests){
	$scope.passwords = {};

	$scope.changePassword = function(passwords){
		requests.changePassword(passwords).then(function(res){
			console.log(res);
		},
		function(err){
			console.log(err);
		});
	};

	
}]);
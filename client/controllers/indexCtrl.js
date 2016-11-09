var app = angular.module("ecommerce");

app.controller('indexCtrl', ['$scope', 'Authentication', '$window','requests', function($scope, Authentication, $window, requests){

	$scope.isLoggedIn = Authentication.isLoggedIn();
	$scope.user = {};
	$scope.categories = [];
	if($scope.isLoggedIn){
		$scope.user = Authentication.currentUser();
	}
	requests.getCategories().then(function(res){
		$scope.categories = res.data;
	},
	function(err){
		alert(err);
	});

	$scope.logout = function(){
		Authentication.logout();
		$window.location = '/#/';
		$window.location.reload();
	}
}]);
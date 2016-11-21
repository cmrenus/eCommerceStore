var app = angular.module("ecommerce");

app.controller('indexCtrl', ['$scope', 'Authentication', '$window','requests', '$location', function($scope, Authentication, $window, requests, $location){

	$scope.isLoggedIn = Authentication.isLoggedIn();
	$scope.user = {};
	$scope.categories = [];
	$scope.numCartItems = 0;
	if($scope.isLoggedIn){
		$scope.user = Authentication.currentUser();
	}
	requests.getCategories().then(function(res){
		$scope.categories = res.data;
	},
	function(err){
		alert(err);
	});

	requests.getCartItems().then(function(res){
		if(res.data.cart == undefined){
			$scope.numCartItems = 0;
		}
		else{
			$scope.numCartItems = Object.keys(res.data.cart).length;
		}
	},
	function(err){
		console.log(err);
	})

	$scope.logout = function(){
		Authentication.logout();
		$window.location = '/#/';
		$window.location.reload();
	}

	//Menu Items
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
    console.log($location.path());
    console.log($window);
}]);
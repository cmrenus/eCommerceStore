var app = angular.module("ecommerce");

//controller for whole application, used mainly for header
app.controller('indexCtrl', ['$scope', 'Authentication', '$window','requests', '$location','$sce', '$document', '$rootScope', function($scope, Authentication, $window, requests, $location, $sce, $document, $rootScope){

	//initialize variables
	$scope.isLoggedIn = Authentication.isLoggedIn(); //check if user logged in
	$scope.user = {};
	$scope.categories = [];
	$scope.numCartItems = 0;
	$scope.registrationTooltip = $sce.trustAsHtml('<div>Don\'t have an Account? <a href="/#/register">Register Here</a></div>');

	$scope.popover = {open: false};

	//is user logged in?
	if($scope.isLoggedIn){
		$scope.user = Authentication.currentUser();
	}

	//get all item categories for dropdown menu
	requests.getCategories().then(function(res){
		$scope.categories = res.data;
	},
	function(err){
		swal("Error", err, "error")
	});

	//get count of cart items to for the cart button
	requests.getCartItems().then(function(res){
		if(res.data.cart == undefined){
			$scope.numCartItems = 0;
		}
		else{
			$scope.numCartItems = Object.keys(res.data.cart).length;
		}
	},
	function(err){
		swal("Error", err, "error")
	});

	//logout
	$scope.logout = function(){
		Authentication.logout();
		$window.location = '/#/';
		$window.location.reload();
	}

	//Menu Items 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

}]);
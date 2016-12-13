var app = angular.module("ecommerce");
//controller for the store page
app.controller("allStoreItemsCtrl", ["$scope","requests", "$location","$routeParams", "$window", function($scope, requests, $location, $routeParams, $window){
	$scope.allItems = []; //array of all items
	$scope.categories = []; //array of all the categories
	$scope.currentCategory = $location.search().category;
	$scope.numItems = 9;
	$scope.currentPage = $routeParams.page;

	//initializations on page load
	var init = function(){
		var params = $location.search();//grab URL parameters

		//get all categories for the left side menu
		requests.getCategories().then(function(res){
			$scope.categories = res.data;
		},
		function(err){
			swal("Error", err, "error");
		});

		//get all items based on the URL parameters
		requests.getAllItems(params).then(function(res){
			$scope.allItems = res.data.data;
			$scope.numItems = res.data.numItems;
		},
		function(err){
			swal("Error", err, "error");
		});
	}
	init();

	//on page change for pagination	
	$scope.pageChange = function(){
		//$window.location.href = "http://localhost:8000/#/shop?category=" + $routeParams.category + "&page=" + $scope.currentPage;
		$location.path('/shop').search({category: $routeParams.category, page:$scope.currentPage});
	}

	//highlight the category that search is being narrowed by
	$scope.isActive = function(category){
		return category === $scope.currentCategory;
	}
}]);	
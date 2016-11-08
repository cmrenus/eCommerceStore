var app = angular.module("ecommerce");

app.controller("allStoreItemsCtrl", ["$scope","requests", "$location", function($scope, requests, $location){
	$scope.allItems = [];
	$scope.categories = [];
	init();
	var init = function(){
		var params = $location.search();

		/*requests.getCategories().then(function(res){
			
		},
		function(err){
			alert(err);
		});*/

		requests.getAllItems(params).then(function(res){
			allItems = res.data;
		},
		function(err){
			alert(err);
		});


	}

}]);	
app = angular.module('ecommerce');

//controller for the homepage
app.controller('homeCtrl', ['$scope', 'requests', function($scope, requests){

	//get items for new items section
	requests.getNewStoreItems().then(function(res){
		$scope.allItems = res.data;
	},
	function(err){
		swal("Error", err, "error");
	})
}]);
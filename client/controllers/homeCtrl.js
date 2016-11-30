app = angular.module('ecommerce');

app.controller('homeCtrl', ['$scope', 'requests', function($scope, requests){
	$scope.activeSlide = 0;
	$scope.slides = [
		{image: 'resources/images/photogrid.jpg', id: 0}/*,
		{image: 'resources/images/photogrid.jpg', id: 1},
		{image: 'resources/images/photogrid.jpg', id: 2}*/
	];

	requests.getNewStoreItems().then(function(res){
		$scope.allItems = res.data;
	},
	function(err){
		console.log(err);
	})
}]);
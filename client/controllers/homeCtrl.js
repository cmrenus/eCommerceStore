app = angular.module('ecommerce');

app.controller('homeCtrl', ['$scope', function($scope){
	$scope.activeSlide = 0;
	$scope.slides = [
		{image: 'resources/images/photogrid.jpg', id: 0}/*,
		{image: 'resources/images/photogrid.jpg', id: 1},
		{image: 'resources/images/photogrid.jpg', id: 2}*/
	];

}]);
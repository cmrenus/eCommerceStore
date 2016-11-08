var app = angular.module("ecommerce", ["ngRoute", "ui.bootstrap"]);

app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: "client/views/home.html",
		controller: "homeCtrl"
	}).
	when('/login', {
		templateUrl: "client/views/login.html",
		controller:"authCtrl"
	}).
	when('/register', {
		templateUrl: "client/views/register.html",
		controller:"authCtrl"
	}).
	when('/shop', {
		templateUrl: 'client/views/allStoreItems.html',
		controller: 'allStoreItemsCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);
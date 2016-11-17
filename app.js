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
	when('/shop/:sku', {
		templateUrl: 'client/views/storeItem.html',
		controller: 'storeItemCtrl'
	}).
	when('/cart', {
		templateUrl: 'client/views/cart.html',
		controller: 'cartCtrl'
	}).
	when('/userAccount', {
		templateUrl: '/client/views/userAccount.html'
	}).
	when('/myOrders', {
		templateUrl: '/client/views/userOrders.html'
	}).
	when('/myWishlist', {
		templateUrl: '/client/views/wishlist.html'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);
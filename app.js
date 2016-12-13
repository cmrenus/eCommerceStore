var app = angular.module("ecommerce", ["ngRoute", "ui.bootstrap"]);

app.config(["$routeProvider", "$uibTooltipProvider", function($routeProvider, $uibTooltipProvider){
	//routing configuration for application
	//places controller to a view and specifies the route, can also declare whether a route should be restricted
	$routeProvider.
	when('/', {
		templateUrl: "client/views/home.html",
		controller: "homeCtrl"
	}).
	when('/login', {
		templateUrl: "client/views/login.html",
		controller:"authCtrl",
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
		templateUrl: '/client/views/userAccount.html',
		controller: 'userAccountCtrl',
		restricted: true
	}).
	when('/myOrders', {
		templateUrl: '/client/views/userOrders.html',
		controller: 'userOrdersCtrl',
		restricted: true
	}).
	when('/myOrders/:orderNum', {
		templateUrl: '/client/views/userOrder.html',
		controller: 'userOrderCtrl',
		restricted: true
	}).
	when('/myWishlist', {
		templateUrl: '/client/views/wishlist.html',
		restricted: true
	}).
	when('/contact', {
		templateUrl: '/client/views/contact.html'
	}).
	when('/checkout', {
		templateUrl: '/client/views/checkoutProcess.html',
		controller: 'checkoutCtrl'
	}).
	when('/purchaseConfirmation', {
		templateUrl: '/client/views/checkoutConfirmation.html',
		controller: 'checkoutConfirmationCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);

app.run(['$rootScope', '$location', '$route', 'Authentication', function($rootScope, $location, $route, Authentication){

	$rootScope.$on("$routeChangeStart", function(event, next, current){
		//if a route is restricted and user is not logged in, redirect them
		if(next.$$route != undefined && next.$$route.restricted == true && !Authentication.isLoggedIn()){
			$location.path('/');
		}
		//if logged in, should not be able to access login or register page
		if((next.$$route.originalPath === '/login' || next.$$route.originalPath === '/register') && Authentication.isLoggedIn()){
			$location.path('/');
		}
	});
}]);
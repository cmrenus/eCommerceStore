var app = angular.module("ecommerce", ["ngRoute", "ui.bootstrap"]);

app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: "client/views/home.html",
		controller: "homeCtrl"
	}).
	otherwise({
		redirectTo: '/'
	});
}]);
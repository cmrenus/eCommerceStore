angular.module('ecommerce').
service('Authentication', ['$http', '$window', 'requests', function($http, $window, requests){
	var saveToken = function(token){
		$window.localStorage['userToken'] = token;
	};

	var getToken = function(){
		return $window.localStorage['userToken'];
	}

	logout = function(){
		$window.localStorage.removeItem('userToken');
	};

	var isLoggedIn = function(){
		var token = getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
			return payload.exp > Date.now() / 1000;
		}
		else{
			return false;
		}
	};

	var currentUser = function(){
		if(isLoggedIn()){
			var token = getToken();
			var payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
			return {email: payload.email, name: payload.name};
		}
	};

	var register = function(user){
		requests.register(user).then(function(res){
			saveToken(res.token);
		},
		function(err){

		});
	}

	var login = function(user){
		requests.login(user).then(function(res){
			saveToken(res.token);
		},
		function(err){

		});
	};

	return {
		saveToken: saveToken,
		getToken: getToken,
		logout: logout
	};
}]);
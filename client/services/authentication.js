//service for authentication
angular.module('ecommerce').
service('Authentication', ['$http', '$window', function($http, $window){
	//save JWT within local storage
	var saveToken = function(token){
		$window.localStorage['userToken'] = token;
	};

	//retrieve the JWT token
	var getToken = function(){
		return $window.localStorage['userToken'];
	}

	//remove the JWT token
	logout = function(){
		$window.localStorage.removeItem('userToken');
	};

	//check if user is logged in based on the expiration in JWT
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

	//if user is logget in, retrieve their information from the JWT
	var currentUser = function(){
		if(isLoggedIn()){
			var token = getToken();
			var payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
			return payload;
		}
	};

	return {
		saveToken: saveToken,
		getToken: getToken,
		logout: logout,
		isLoggedIn: isLoggedIn,
		currentUser: currentUser
	};
}]);
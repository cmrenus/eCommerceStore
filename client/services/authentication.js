angular.module('ecommerce').
service('Authentication', ['$http', '$window', function($http, $window){
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
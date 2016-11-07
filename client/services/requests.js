angular.module('ecommerce')
.service('requests', ['$http', function($http){
		this.login = function(user){
			return $http({
				method: 'POST',
				url: '/login',
				data: user
			});
		};

		this.register = function(user){
			return $http({
				method: 'POST',
				url: '/register',
				data: user
			});
		};
}]);
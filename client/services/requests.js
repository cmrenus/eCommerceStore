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

		this.getAllItems = function(params){
			return $http({
				method: 'GET',
				url: '/storeItems',
				params: params
			});
		};

		this.getCategories = function(){
			return $http({
				method: 'GET',
				url: '/categories'
			});
		};

		this.getItemDetails = function(sku){
			return $http({
				method: 'GET',
				url: '/storeItem',
				params: {sku: sku}
			});
		};
}]);
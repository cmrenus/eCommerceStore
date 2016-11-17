angular.module('ecommerce')
.service('requests', ['$http', 'Authentication', function($http, Authentication){
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

		this.addToCart = function(sku, quantity){
			return $http({
				method: 'POST',
				url: '/addToCart',
				data: {sku: sku, quantity: quantity}
			});
		}

		this.getCartItems = function(){
			return $http({
				method: 'GET',
				url: '/cartItems'
			});
		};

		this.removeCartItem = function(sku){
			return $http({
				method: 'DELETE',
				url: '/removeCartItem',
				params: {sku: sku}
			});
		};

		this.updateCart = function(data){
			return $http({
				method: 'PUT',
				url: '/updateCart',
				data: data
			});
		};

		this.changePassword = function(passwords){
			return $http({
				method: 'PUT',
				url: '/changePassword',
				data: passwords,
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    }
			});
		};

		this.saveUserInfo = function(user){
			return $http({
				method: 'PUT',
				url: '/saveUserInfo',
				data: {user: user},
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    }
			})
		}
}]);
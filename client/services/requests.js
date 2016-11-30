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
			});
		};

		this.checkout = function(){
			return $http({
				method: 'POST',
				url: '/checkout',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    }
			});
		};

		this.getOrders = function(){
			return $http({
				method: 'GET',
				url: '/getOrders',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    }
			});
		};

		this.getOrder = function(orderNum){
			return $http({
				method: 'GET',
				url: '/getOrder',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    },
			   	params: {orderNum: orderNum}
			});
		};

		this.getItemRating = function(sku){
			return $http({
				method: 'GET',
				url: '/getItemRating',
				params: {sku: sku}
			});
		};

		this.addRating = function(comment, rate, sku, title){
			return $http({
				method: 'POST',
				url: '/addRating',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    },
			    data: {comment: comment, rate: rate, sku: sku, title: title}
			});
		};

		this.getAllItemRatings = function(sku){
			return $http({
				method: 'GET',
				url: '/allItemRatings',
				params: {sku: sku}
			});
		};

		this.clearCart = function(){
			return $http({
				method: "DELETE",
				url: '/cartItems',
			});
		};
}]);
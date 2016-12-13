//service for all REST endpoints
angular.module('ecommerce')
.service('requests', ['$http', 'Authentication', function($http, Authentication){
		//login. takes user.username and user.password
		this.login = function(user){
			return $http({
				method: 'POST',
				url: '/login',
				data: user
			});
		};

		//register. takes {user: String, password: String}
		this.register = function(user){
			return $http({
				method: 'POST',
				url: '/register',
				data: user
			});
		};

		//get all items from in store
		//take Object {pageNum: Number, category: String}
		this.getAllItems = function(params){
			return $http({
				method: 'GET',
				url: '/storeItems',
				params: params
			});
		};

		//get all categories for items
		this.getCategories = function(){
			return $http({
				method: 'GET',
				url: '/categories'
			});
		};

		//get the details for a specific item
		//takes an items sku
		this.getItemDetails = function(sku){
			return $http({
				method: 'GET',
				url: '/storeItem',
				params: {sku: sku}
			});
		};

		//add an item to a users cart
		//takes an items sku, as well as a quantity for that item
		this.addToCart = function(sku, quantity){
			return $http({
				method: 'POST',
				url: '/addToCart',
				data: {sku: sku, quantity: quantity}
			});
		}

		//retrieve all items within a users cart
		//this is based off of session variable
		this.getCartItems = function(){
			return $http({
				method: 'GET',
				url: '/cartItems'
			});
		};

		//remove an item from the cart
		//takes an items sku
		this.removeCartItem = function(sku){
			return $http({
				method: 'DELETE',
				url: '/removeCartItem',
				params: {sku: sku}
			});
		};

		//update the items within a cart
		//takes cart information to know how to update quantities
		this.updateCart = function(data){
			return $http({
				method: 'PUT',
				url: '/updateCart',
				data: data
			});
		};

		//change a users password
		//takes object{old: String, new: String, retype: String}
		//uses JWT in order to authenticate user
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

		//saves shipping information for a user
		//takes object of shipping information
		//uses JWT to authenticate the user
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

		//checkout and purchase items in cart
		//takes user information, and object{payment: String, shippingMethod: String}
		//uses Authentication to pass back whether the user is logged in or not to associate a userId with the orders
		this.checkout = function(user, check){
			return $http({
				method: 'POST',
				url: '/checkout',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    },
			    data:{
			    	user: user,
			    	paymentMethod: check.payment,
			    	shippingMethod: check.shippingMethod
			    } 
			});
		};

		//get a users orders
		//uses authentication so only user can access
		this.getOrders = function(){
			return $http({
				method: 'GET',
				url: '/getOrders',
				headers: {
			    	Authorization: 'Bearer '+ Authentication.getToken()
			    }
			});
		};

		//get information for a specific order
		//takes a Number, order number
		//Uses authentication so only user can access
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

		//get the average rating for a specific item
		//takes the sku of an item
		this.getItemRating = function(sku){
			return $http({
				method: 'GET',
				url: '/getItemRating',
				params: {sku: sku}
			});
		};

		//add a arating to an item
		//takes String comment, Number rating, String sku, and String title
		//uses authentication as only logged in users can leave ratings
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

		//get all ratings for an item
		//takes and items SKU
		this.getAllItemRatings = function(sku){
			return $http({
				method: 'GET',
				url: '/allItemRatings',
				params: {sku: sku}
			});
		};

		//delete all items from a cart
		this.clearCart = function(){
			return $http({
				method: "DELETE",
				url: '/cartItems',
			});
		};

		//get the newest store items. 
		this.getNewStoreItems = function(){
			return $http({
				method: "GET",
				url: '/storeItems',
				params: {sort: "date"}
			});
		};
}]);
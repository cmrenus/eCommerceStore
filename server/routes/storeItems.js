var db = require('../db');

	router = require('express').Router(),
	autoincrement = require("mongodb-autoincrement"),
	mongo = require("mongodb"),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

	router.get('/storeItems', function(req,res){
		if(req.params.category){

		}
		var collection = db.get().collection('items');
		collection.find().toArray(function(err, docs){
			if(err){
				res.status(400).json(err);
			}
			res.status(200).json(docs);
		});
	});

	router.get('/categories', function(req, res){
		var collection = db.get().collection('items');
		collection.distinct("category", function(err, docs){
			if(err) res.status(400).json(err);
			res.status(200).json(docs);
		});
	});

	router.get('/storeItem', function(req, res){
		var collection = db.get().collection('items');
		collection.find({"sku": req.query.sku}).toArray(function(err, docs){
			if(err) res.status(400).json(err);
			res.status(200).json(docs[0]);
		});
	});

	router.post('/addToCart', function(req, res){
		if(!req.session.cart){
			req.session.cart = {};
			console.log("No cart")
		}
		if(!req.session.cart[req.body.sku]){
			console.log("no sku");
			var collection = db.get().collection('items');
			collection.find({"sku": req.body.sku}).toArray(function(err, docs){

				if(err) res.status(400).json(err);
				console.log("found sku");
				if(docs[0].quantity < req.session.quantity){
					res.status(400).send("Not enough quantity for the selected item");
				}
				req.session.cart[req.body.sku] = {quantity: req.body.quantity, price: docs[0].price};
				res.status(200).send();
			});
		}
		else{
			console.log("sku exists");
			req.session.cart[req.body.sku].quantity = req.body.quantity;
			res.status(200).send();
		}
	});

	router.get('/cartItems', function(req, res){
		if(!req.session.cart || Object.keys(req.session.cart).length == 0){
			res.status(200).send({empty: true, message: "No items in cart"});
		}
		else{
			var collection = db.get().collection('items');
			collection.find({sku: {$in : Object.keys(req.session.cart)}}).toArray(function(err, docs){
				if(err) res.status(400).json(err);
				res.status(200).send({cartDetails: docs, cart: req.session.cart});
			});
		}
	});

	router.delete('/removeCartItem', function(req, res){
		console.log(req.query.sku);
		if(!req.session.cart || Object.keys(req.session.cart).length == 0){
			res.status(400).send("No items to remove");
		}
		else if(!req.session.cart[req.query.sku]){
			res.status(404).send("Item is not in cart");
		}
		else{
			delete req.session.cart[req.query.sku];
			res.status(200).send("Item removed from cart!");
		}
	});

	router.put('/updateCart', function(req, res){
		if(!req.session.cart || Object.keys(req.session.cart).length == 0){
			res.status(400).send("No cart to edit");
		}
		else{
			req.session.cart = req.body;
			var x = 0;
			var length = Object.keys(req.session.cart).length
			for(x; x < length;){
				var keys = Object.keys(req.session.cart);
				if(req.session.cart[keys[x]].quantity == 0){
					delete req.session.cart[keys[x]];
					length = length - 1;
				}
				else{
					x++
				}
				console.log(length);
				if(x == length){
					res.status(200).send("Cart Updated");
				}
			}
			
		}
	});

	router.post('/checkout', auth, function(req, res){
		//console.log(req.headers.authorization);
		if(!req.session.cart || Object.keys(req.session.cart).length == 0){
			res.status(400).send("No Items in cart!");
		}
		else{
			//does not handle quantities
			var itemsCollection = db.get().collection("items");
			var ordersCollection = db.get().collection("orders");
			itemsCollection.find({sku: {$in: Object.keys(req.session.cart)}}).toArray(function(err, docs){
				var finalTotal = 0
				for(var x = 0; x < docs.length; x++){
					finalTotal += docs[x].price * req.session.cart[docs[x].sku].quantity;
					if(x == docs.length - 1){
						finalTotal+= 10;
						console.log(finalTotal);
						autoincrement.getNextSequence(db.get(), "orders", function(err, autoIndex){
							console.log(req.payload);
							var order = {totalCost: finalTotal, orderNum: autoIndex, date: new Date(), status: "Received", items: docs, cart: req.session.cart};
							if(!req.payload._id){
								ordersCollection.insert(order, function(err, docs){
									if(err){res.status(500).send("Could not complete order"); return;}
									else{
										req.session.cart = {};
										res.status(200).send("Order has been sent");
									}
								});
							}
							else{
								User.findById(req.payload._id).exec(function(err, user){
									if(err){
										req.status(400).send("Could not find User account");
										return;
									}
									order.user = user._id;
									ordersCollection.insert(order, function(err, docs){
										if(err){res.status(500).send("Could not complete order"); return;}
										else{
											req.session.cart = {};
											res.status(200).send("Order has been sent");
										}
									});
								});
							}
						})
					}
				}
			});
		}
	});

	router.get('/getOrders', auth, function(req, res){
		if(!req.payload._id){
			res.status(400).send("No user Access");
			return;
		}
		else{
			var collection = db.get().collection("orders");
			User.findById(req.payload._id).exec(function(err, user){
				if(err){
					res.status(400).send("User Account does not exist");
					return;
				}
				else{
					collection.find({user: new mongo.ObjectId(user._id)}).toArray(function(err, docs){
						if(err){
							res.status(500).send("Internal Error");
							return;
						}
						else{
							res.status(200).send(docs);
						}
					})
				}
			})
		}
	});

	router.get('/getOrder', auth, function(req, res){
		if(!req.payload._id){
			res.status(400).send("No user access");
			return;
		}
		else{
			var collection = db.get().collection("orders");
			User.findById(req.payload._id).exec(function(err, user){
				if(err){
					res.status(500).send("Internal Error");
					return;
				}
				else{
					collection.find({orderNum: Number(req.query.orderNum)}).toArray(function(err, docs){
						if(err){
							res.status(404).send("No order found");
							return;
						}
						console.log(docs);
						res.status(200).send(docs[0]);
					});
				}
			});
		}
	});







	module.exports = router;/*
module.exports.getStoreItems = function(req, res){
	if(req.params.category){

	}
	var collection = db.get().collection('items');
	collection.find().toArray(function(err, docs){
		if(err){
			res.status(400).json(err);
		}
		res.status(200).json(docs);
	});
}

module.exports.getCategories = function(req, res){
	var collection = db.get().collection('items');
	collection.distinct("category", function(err, docs){
		if(err) res.status(400).json(err);
		res.status(200).json(docs);
	});
};

module.exports.getStoreItemDetails = function(req, res){
	var collection = db.get().collection('items');
	collection.find({"sku": req.query.sku}).toArray(function(err, docs){
		if(err) res.status(400).json(err);
		res.status(200).json(docs[0]);
	});
};

module.exports.addToCart = function(req, res){
	console.log(req.session);
	if(!req.session.cart){
		req.session.cart = {};
	}
	if(!req.session.cart[req.body.sku]){
		var collection = db.get().collection('items');
		collection.find({"sku": req.body.sku}).toArray(function(err, docs){
			if(err) res.status(400).json(err);
			if(docs[0].quantity < req.session.quantity){
				res.status(400).send("Not enough quantity for the selected item");
			}
			res.session.cart[sku] = {quantity: req.session.quantity, price: docs[0].price};
			res.status(200);
		});
	}
};*/
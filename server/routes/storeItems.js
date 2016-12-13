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

//get all store items
router.get('/storeItems', function(req,res){
	var query = {category: req.query.category};
	var collection = db.get().collection('items');
	//check if date included, search for newest items
	if(req.query.sort == "date"){
		//sort in descending order by date and take only 3
		collection.find().sort({dateAdded: -1}).limit(3).toArray(function(err, docs){
			if(err){
				res.status(400).json(err);
				return;
			}
			res.status(200).send(docs);
		})
	}
	else{
		//check the category
		if(req.query.category == "all"){
			query = {};
		}
		var amountPerPage = 9;
		var page = 1;
		if(req.query.page){
			page = req.query.page;
		}
		//total count of pages
		collection.count(query, function(err, count){
			//query items by category, skip based upon page and limit to max per page
			collection.find(query).skip(amountPerPage * (req.query.page-1)).limit(amountPerPage).toArray(function(err, docs){
				if(err){
					res.status(400).json(err);
				}
				res.status(200).json({numItems: count, data: docs});
			});
		})
		
	}
});

//get all categories
router.get('/categories', function(req, res){
	var collection = db.get().collection('items');
	//grabs distinct categories
	collection.distinct("category", function(err, docs){
		if(err) res.status(400).json(err);
		res.status(200).json(docs);
	});
});

//get an individual store item based on sku
router.get('/storeItem', function(req, res){
	var collection = db.get().collection('items');
	collection.find({"sku": req.query.sku}).toArray(function(err, docs){
		if(err) res.status(400).json(err);
		res.status(200).json(docs[0]);
	});
});

//add an item to cart
router.post('/addToCart', function(req, res){
	//does cart variable exist
	if(!req.session.cart){
		req.session.cart = {};
		console.log("No cart")
	}
	//if item is not already in cart
	if(!req.session.cart[req.body.sku]){
		var collection = db.get().collection('items');
		collection.find({"sku": req.body.sku}).toArray(function(err, docs){
			if(err) res.status(400).json(err);
			//check the amount of quantity wanted vs stock of the item
			if(docs[0].quantity < req.session.quantity){
				res.status(400).send("Not enough quantity for the selected item");
			}
			req.session.cart[req.body.sku] = {quantity: req.body.quantity, price: docs[0].price};
			res.status(200).send();
		});
	}
	else{ //if the item is already in the cart
		req.session.cart[req.body.sku].quantity = req.body.quantity;
		res.status(200).send();
	}
});

//get all items within cart
router.get('/cartItems', function(req, res){
	//check if cart object exists and if items in the cart
	if(!req.session.cart || Object.keys(req.session.cart).length == 0){
		res.status(200).send({empty: true, message: "No items in cart"});
	}
	else{
		var collection = db.get().collection('items');
		//retrieve information for cart items from the keys within cart
		collection.find({sku: {$in : Object.keys(req.session.cart)}}).toArray(function(err, docs){
			if(err) res.status(400).json(err);
			res.status(200).send({cartDetails: docs, cart: req.session.cart});
		});
	}
});

//delete all cart items
router.delete('/cartItems', function(req, res){
	//check for cart object, and check if any items in cart if exists
	if(!req.session.cart || Object.keys(req.session.cart).length == 0){
		res.status(200).send({empty: true, message: "No items in cart"});
	}
	else{//empty cart
		req.session.cart = undefined;
		res.status(200).send("Cart Cleared");
	}
});

//delete one item from cart
router.delete('/removeCartItem', function(req, res){
	//check for cart object, and check if any items in cart if exists
	if(!req.session.cart || Object.keys(req.session.cart).length == 0){
		res.status(400).send("No items to remove");
	}
	else if(!req.session.cart[req.query.sku]){//check if deleting item is in cart
		res.status(404).send("Item is not in cart");
	}
	else{ //delete item from cart
		delete req.session.cart[req.query.sku];
		res.status(200).send("Item removed from cart!");
	}
});

//update items in cart
router.put('/updateCart', function(req, res){
	//check for cart object, and check if any items in cart if exists
	if(!req.session.cart || Object.keys(req.session.cart).length == 0){
		res.status(400).send("No cart to edit");
	}
	else{
		req.session.cart = req.body;
		var x = 0;
		var length = Object.keys(req.session.cart).length
		//loop through all items in cart
		for(x; x < length;){
			var keys = Object.keys(req.session.cart);
			//if updated quantity is 0, delete it
			if(req.session.cart[keys[x]].quantity == 0){
				delete req.session.cart[keys[x]];
				length = length - 1;
			}
			else{
				x++
			}
			//when looped through all items to keep synchronous
			if(x == length){
				res.status(200).send("Cart Updated");
			}
		}
		
	}
});

//checkout 
router.post('/checkout', auth, function(req, res){
	//check for cart object, and check if any items in cart if exists
	if(!req.session.cart || Object.keys(req.session.cart).length == 0){
		res.status(400).send("No Items in cart!");
	}
	else{
		//does not handle quantities
		var itemsCollection = db.get().collection("items");
		var ordersCollection = db.get().collection("orders");
		//find all item information based on cart
		itemsCollection.find({sku: {$in: Object.keys(req.session.cart)}}).toArray(function(err, docs){
			var finalTotal = 0
			//loop through all items
			for(var x = 0; x < docs.length; x++){
				//summate final total
				finalTotal += docs[x].price * req.session.cart[docs[x].sku].quantity;
				//if looped through all items
				if(x == docs.length - 1){
					finalTotal+= 10; //add shipping cost
					//pull next sequence for order number
					autoincrement.getNextSequence(db.get(), "orders", function(err, autoIndex){
						//shipping address
						var address = {
							street: req.body.user.street,
							city: req.body.user.city,
							zip: req.body.user.zip,
							state: req.body.user.state,
							country: req.body.user.country,
							company: req.body.user.company,
							name: req.body.user.firstName + " " + req.body.user.lastName
						};
						//order object
						var order = {totalCost: finalTotal, orderNum: autoIndex, date: new Date(), status: "Received", items: docs, cart: req.session.cart, shippingAddress: address, paymentMethod: req.body.payment, shippingMethod: req.body.shippingMethod};
						//if user is not logged in
						if(!req.payload._id){
							//insert order into collection
							ordersCollection.insert(order, function(err, docs){
								if(err){res.status(500).send("Could not complete order"); return;}
								else{
									req.session.cart = {};
									res.status(200).send({data:"Order has been sent", orderNum: order.orderNum});
								}
							});
						}
						else{//if user logged in
							//find user by id
							User.findById(req.payload._id).exec(function(err, user){
								if(err){
									req.status(400).send("Could not find User account");
									return;
								}
								order.user = user._id;
								//insert order with users id included 
								ordersCollection.insert(order, function(err, docs){
									if(err){res.status(500).send("Could not complete order"); return;}
									else{
										req.session.cart = {};
										console.log(order.orderNum);

										res.status(200).send({data:"Order has been sent", orderNum: order.orderNum});
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

//get all orders for a user
router.get('/getOrders', auth, function(req, res){
	//if user is not logged in
	if(!req.payload._id){
		res.status(400).send("No user Access");
		return;
	}
	else{
		var collection = db.get().collection("orders");
		//get user by id
		User.findById(req.payload._id).exec(function(err, user){
			if(err){
				res.status(400).send("User Account does not exist");
				return;
			}
			else{
				//find orders based on user id
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

//get order details
router.get('/getOrder', auth, function(req, res){
	//if not logged in
	if(!req.payload._id){
		res.status(400).send("No user access");
		return;
	}
	else{
		var collection = db.get().collection("orders");
		//find user by id
		User.findById(req.payload._id).exec(function(err, user){
			if(err){
				res.status(500).send("Internal Error");
				return;
			}
			else{
				//find order by order number
				collection.find({orderNum: Number(req.query.orderNum), user: new mongo.ObjectId(user._id)}).toArray(function(err, docs){
					if(err){
						res.status(404).send("No order found");
						return;
					}
					res.status(200).send(docs[0]);
				});
			}
		});
	}
});

//get average item rating
router.get('/getItemRating', function(req, res){

	var collection = db.get().collection("ratings");
	collection.aggregate([
		{	//find ratings for certain sku
			$match: {sku: req.query.sku}
		},
		{//group all, exclude the _id field, and avg the rate field
			$group: {
				_id: 0,
				rating: {$avg: "$rate"}
			}
		}
	], function(err, docs){
		if(err){console.log(err); return;}
		res.send(docs[0]);
	});
});

//add a new rating
router.post('/addRating', auth, function(req, res){
	//if user is not logged in
	if(!req.payload._id){
		res.status(400).send("No user access");
		return;
	}
	else{//if user logged in
		var collection = db.get().collection("ratings");
		//find user by id
		User.findById(req.payload._id).exec(function(err, user){
			if(err){
				res.status(500).send("Internal Error");
				return;
			}
			else{
				var rating = {sku: req.body.sku, rate: req.body.rate, comment: req.body.comment, userName: user.firstName + " " + user.lastName, userID: user._id, data: new Date(), title: req.body.title};
				//insert new rating
				collection.insert(rating, function(err, results){
					if(err){res.status(500).send("Could not add Rating"); return;}
					res.status(200).send("Rating Successfully Added!");
				});
			}
		});
	}
});

//get all ratings for an item
router.get('/allItemRatings', function(req, res){
	var collection = db.get().collection("ratings");
	//find all ratings based on sku
	collection.find({sku: req.query.sku}).toArray(function(err, docs){
		if(err){res.status(500).send("Internal Error"); return;}
		res.send(docs);
	});
});


module.exports = router;
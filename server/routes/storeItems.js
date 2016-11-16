var db = require('../db');

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
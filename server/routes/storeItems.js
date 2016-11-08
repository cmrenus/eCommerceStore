var db = require('../db');

module.exports.getStoreItems = function(req, res){
	if(req.params.category){

	}

	var collection = db.get().collection('items');
	collection.find().toArray(function(err, docs){
		if(err){
			res.status(400).json(err);
		}
		res.status(400).json(docs);
	});
}
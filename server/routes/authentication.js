var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


module.exports.register = function(req, res) {
	var user = new User();

	user.name = req.body.name, user.email = req.body.email;

	user.createPassword(req.body.password);

	user.save(function(err){
		var token;
		token = user.generateJwt();
		res.status(200).json({"token": token});
	});
};

module.exports.login = function(req, res){
	passport.authenticate('local', function(err, user, info){
		var token;
		if(err){
			res.status(404).json(err);
			return;
		}
		else if(user){
			token = user.generateJwt();
			res.status(200).json({"token": token});
		}
		else{
			res.status(401).json(info);
		}
	})(req, res);
};

module.exports.changePassword = function(req, res){
	if (!req.payload._id) {
	    res.status(401).json({
	      "message" : "UnauthorizedError: private profile"
	    });
	} else {
	    // Otherwise continue
	    User.findById(req.payload._id).exec(function(err, user) {
	    	if(err){
	    		res.status(400).json(err);
	    	}

	    	if(user.validatePassword(req.body.old) && req.body.new == req.body.retype){
	    		user.createPassword(req.body.new);
	    		user.save(function(err){
	    			if(err){res.status(500).send(err)}
	    			res.status(200).json("Password successfully changed!");
	    		});
	    	}
	    	else{
	    		res.status(402).json("Incorrect passwords");
	    	}
	    });
	}
};

module.exports.saveUserInfo = function(req, res){
	if(!req.payload._id) {
		res.status(401).json("unauthorized access: Private Profile");
	}
	else{
		User.findById(req.payload._id).exec(function(err, user){
			if(err){
				res.status(400).json(err);
				return;
			}
			var newInfo = req.body.user;
			user.firstName = newInfo.firstName;
			user.lastName = newInfo.lastName;
			user.company = newInfo.company;
			user.street = newInfo.street;
			user.city = newInfo.city;
			user.zip = newInfo.zip;
			user.state = newInfo.state;
			user.country = newInfo.country;
			user.telephone = newInfo.telephone;
			user.save(function(err){
				if(err){console.log(err); res.status(500).send(err); return;}
				var token = user.generateJwt();
				res.status(200).json({message: "Info successfully changed!", token: token});
			});
		});
	}
}
var mongoose = require("mongoose"),
    crypto = require('crypto'),
    jwt = require("jsonwebtoken");


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  stree: {
    type: String
  },
  city: {
    type: String
  },
  zip: {
    type: Number
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  telephone: {
    type: String
  },
  hash: String,
  salt: String
});

userSchema.methods.createPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    company: this.company,
    street: this.street,
    city: this.city,
    zip: this.zip,
    state: this.state,
    country: this.country,
    telephone: this.telephone,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

mongoose.model('User', userSchema);
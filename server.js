var express = require('express'),
	serverPort = 8000,
	path = require('path'),
	//session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  db = require('./server/db'),
  session = require('express-session'),
	app = express(),
  MongoDBStore = require('connect-mongodb-session')(session),
  cookie = require('cookie');

var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var dbURI='mongodb://localhost:27017/maskMakers';
var mongoosedb = require('mongoose').connect(dbURI);
var sessionStore = new MongoDBStore({
  uri: dbURI,
  collection: 'mySessions'
});

sessionStore.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

require('./server/models/user');
require('./server/config/strategy')

var routes = require('./server/routes/index');
var authentication = require('./server/routes/authentication');
var items = require('./server/routes/storeItems');
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());



//static file usage
app.use('/', express.static(path.join(__dirname, '/')));

app.use(session({
    secret: 'super secret key',
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
}));

app.use('/', routes);


/*
app.use(function(req, res, next){
  console.log(req.session);
  console.log(req.session.id);
  console.log(req.cookies);
  next();
});
*/
app.use('/login', authentication.login);
app.use('/register', authentication.register);
app.use('/changePassword', auth, authentication.changePassword);
app.use('/saveUserInfo', auth, authentication.saveUserInfo);
/*app.use('/storeItems', items.getStoreItems);
app.use('/categories', items.getCategories);
app.use('/storeItem', items.getStoreItemDetails);
app.use('/addToCart', items.addToCart);*/
app.use('/', items);

db.connect(dbURI, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    console.log(err);
    process.exit(1)
  } else {
    app.listen(serverPort, function() {
      console.log('Server running on port ' + serverPort + '.')
    })
  }
});
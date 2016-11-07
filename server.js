var express = require('express'),
	serverPort = 8000,
	path = require('path'),
	//session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
  passport = require('passport'),
  mongoose = require('mongoose'),
	//db = require('./server/db'),
	app = express();

var uri='mongodb://localhost:27017/maskMakers';
var db = require('mongoose').connect(uri);

require('./server/models/user');
require('./server/config/strategy')

var routes = require('./server/routes/index');
var authentication = require('./server/routes/authentication');
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());

//static file usage
app.use('/', express.static(path.join(__dirname, '/')));


app.use('/', routes);

app.use('/login', authentication.login);
app.use('/register', authentication.register);
/*db.connect(dbURI, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {*/
    app.listen(serverPort, function() {
      console.log('Server running on port ' + serverPort + '.')
    })
  /*}
});*/
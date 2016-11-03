var express = require('express'),
	serverPort = 8000,
	path = require('path'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	//db = require('./server/db'),
	app = express();

var routes = require('./server/routes/index');
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//static file usage
app.use('/', express.static(path.join(__dirname, '/')));


app.use('/', routes);
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
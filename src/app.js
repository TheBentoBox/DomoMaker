// Import libraries
var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');

// Get database URL
var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/DomoMaker";

// Connect to the database
var db = mongoose.connect(dbURL, function(err) {
	if (err) {
		console.log("Could not connect to the database.");
		throw err;
	}
});

// Get the redis URL
var redisURL = {
	hostname: 'localhost',
	port: 6379
};

var redisPASS;

// Update redis URL to cloud version if this is running on a server
if (process.env.REDISCLOUD_URL) {
	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPASS = redisURL.auth.split(":")[1];
}

// Grab the router
var router = require('./router.js');

// Get the server port
var port = process.env.PORT || process.env.NODE_PORT || 3000;

// Create the express app and set it up with our libraries
var app = express();
app.use('/assets', express.static(path.resolve(__dirname + '/../client')));	// load in assets folder
app.use(compression());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	key: "sessionid",
	store: new RedisStore({
		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPASS
	}),
	secret: 'Domo Arigato',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set(favicon(__dirname + '/../client/img/favicon.png'));
app.use(cookieParser());

// Send the app to the router
router(app);

// Start the server
app.listen(port, function(err) {
	if (err) {
		throw err;
	}
	
	console.log('Listening on port ' + port);
});
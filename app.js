const express = require('express');
const session = require('express-session');
const path = require('path');

// require routes
const routes = require('./routes/index');

// define app
const app = express();

// get the public files
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// store data from request to request
app.use(session({
	secret: process.env.SES_SECRET,
	key: process.env.SES_KEY,
	resave: false,
	saveUninitialized: false,
}));

// handle routes
app.use('/', routes);

// run the app
app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});

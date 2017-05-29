const express = require('express');
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

// handle routes
app.use('/', routes);

// run the app
app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});

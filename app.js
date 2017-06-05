const path = require('path');
const http = require('http').Server;
const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const app = express();
const server = http(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

// get the public files
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// store data from request to request
app.use(session({
	secret: process.env.SES_SECRET,
	key: process.env.SES_KEY,
	resave: false,
	saveUninitialized: false,
}));

// socket connections
const connections = [];
let score = 0;
let votes = 0;

io.on('connection', (socket) => {
	connections.push(socket);
	console.log(`${connections.length} socket(s) connected`);
	socket.on('disconnect', () => {
		connections.splice(connections.indexOf(socket), 1);
		console.log(`A socket disconnected, ${connections.length} remaining socket(s) connected`);
	});

	// emit time event to the clients
	socket.on('timeEvent', () => {
		const started = 'time event started';
		io.sockets.emit('timeStarted', started)
	});

	socket.on('upVote', () => {
		votes += 1;
		console.log(`current score: ${votes}`);
	});

	socket.on('downVote', () => {
		votes -= 1;
		console.log(`current score: ${votes}`);
	});

	socket.on('voteEnd', () => {
		if (votes > 0) {
			score += 1;
			console.log(`score updated to: ${score}`);
			io.sockets.emit('voteResult', score);
			votes = 0;
		}
	});
});

// handle routes
app.use('/', routes);

// run the app
server.listen(port, () => {
	console.log('Running on http://localhost:3000');
});

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
let upVotes = 0;
let downVotes = 0;

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
		io.sockets.emit('timeStarted', started);
	});

	// update votes
	socket.on('upVote', () => {
		upVotes += 1;
		const total = upVotes + downVotes;
		const percentage = Math.round(upVotes / total * 100);
		console.log(`current score: ${percentage}`);
		io.sockets.emit('percentage', percentage);
	});

	// update votes
	socket.on('downVote', () => {
		downVotes += 1;
		const total = upVotes + downVotes;
		const percentage = Math.round(upVotes / total * 100);
		console.log(`current score: ${percentage}`);
		io.sockets.emit('percentage', percentage);
	});

	// on vote end send final result
	socket.on('voteEnd', () => {
		const total = upVotes + downVotes;
		const percentage = Math.round(upVotes / total * 100);
		console.log(`final percentage: ${percentage}`);

		if (percentage > 50) {
			score += 1;
			console.log(`score updated to: ${score}`);
			io.sockets.emit('voteResult', score);
			upVotes = 0;
			downVotes = 0;
		}
	});
});

// handle routes
app.use('/', routes);

// run the app
server.listen(port, () => {
	console.log('Running on http://localhost:3000');
});

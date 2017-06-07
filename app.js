const path = require('path');
const http = require('http').Server;
const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// require models
require('./models/Game');

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

// connect to the database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
	console.error('mongoose is not connecting');
});

// store data from request to request
app.use(session({
	secret: process.env.SES_SECRET,
	key: process.env.SES_KEY,
	resave: false,
	saveUninitialized: false,
}));

// socket vars
const connections = [];
const Game = mongoose.model('Game');

io.on('connection', (socket) => {
	// socket connection info
	connections.push(socket);
	console.log(`${connections.length} socket(s) connected`);
	socket.on('disconnect', () => {
		connections.splice(connections.indexOf(socket), 1);
		console.log(`A socket disconnected, ${connections.length} remaining socket(s) connected`);
	});

	// socket rooms
	socket.on('create', (room) => {
		Game.find({ game_id: room }, async (err, game) => {
			if (err) throw err;
			let score = game[0].score;
			let upVotes = 0;
			let downVotes = 0;
			
			console.log(`someone entered room: ${room}`);
			socket.join(room);
			io.sockets.in(room).emit('event');

			// emit time event to the clients
			socket.on('timeEvent', () => {
				let counter = 5;
				let interval = setInterval(() => {
					counter -= 1;
					if (counter === 0) {
						clearInterval(interval);
					}
					io.sockets.in(room).emit('timeStarted', counter);
				}, 1000);
			});

			// update votes
			socket.on('upVote', () => {
				upVotes += 1;
				const total = upVotes + downVotes;
				const percentage = Math.round(upVotes / total * 100);
				console.log(`current score: ${percentage}`);
				io.sockets.in(room).emit('percentage', percentage);
			});

			// update votes
			socket.on('downVote', () => {
				downVotes += 1;
				const total = upVotes + downVotes;
				const percentage = Math.round(upVotes / total * 100);
				console.log(`current score: ${percentage}`);
				io.sockets.in(room).emit('percentage', percentage);
			});

			// on vote end send final result
			socket.on('voteEnd', () => {
				const total = upVotes + downVotes;
				const percentage = Math.round(upVotes / total * 100);
				console.log(`final percentage: ${percentage}`);

				if (percentage > 50) {
					score += 1;
					io.sockets.in(room).emit('voteResult', score);
					upVotes = 0;
					downVotes = 0;

					Game.findOneAndUpdate({ game_id: room }, { score: score }, { upsert: true}, (err, result) => {
						if (err) throw err;
						console.log(`score updated to: ${score}`);
					});

				} else {
					io.sockets.in(room).emit('percentage', 0);
				}
			});
		});
	});
});

// handle routes
app.use('/', routes);

// run the app
server.listen(port, () => {
	console.log('Running on http://localhost:3000');
});

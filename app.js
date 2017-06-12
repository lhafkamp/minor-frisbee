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

// sockets
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
			let leftScore = game[0].leftScore;
			let rightScore = game[0].rightScore;
			
			socket.join(room);
			console.log(`someone entered room: ${room}`);

			// update votes
			socket.on('upVote', (obj) => {
				Game.findOne({ game_id: room }, (err, result) => {
					if (obj.leftUpVotes === 1) {
						const leftUpVotes = result.leftUpVotes + 1;
						Game.findOneAndUpdate({ game_id: room }, 
							{ leftUpVotes: leftUpVotes }, 
							{ upsert: true }, (err, data) => {
							if (err) throw err;

							const leftTotal = leftUpVotes + result.leftDownVotes;
							const leftPercentage = Math.round(leftUpVotes / leftTotal * 100) || 0;

							console.log(`current score: ${leftPercentage} - 0`);

							const percentageObj = {
								leftPercentage: leftPercentage,
								rightPercentage: 0
							}
							io.sockets.in(room).emit('percentage', percentageObj);
						});
					}
				});
			});

			socket.on('downVote', (obj) => {
				Game.findOne({ game_id: room }, (err, result) => {
					if (obj.leftDownVotes === 1) {
						const leftDownVotes = result.leftDownVotes + 1;
						Game.findOneAndUpdate({ game_id: room }, 
							{ leftDownVotes: leftDownVotes }, 
							{ upsert: true }, (err, data) => {
							if (err) throw err;

							const leftTotal = result.leftUpVotes + leftDownVotes;
							const leftPercentage = Math.round(result.leftUpVotes / leftTotal * 100) || 0;

							console.log(`current score: ${leftPercentage} - 0`);

							const percentageObj = {
								leftPercentage: leftPercentage,
								rightPercentage: 0
							}
							io.sockets.in(room).emit('percentage', percentageObj);
						});
					}
				});
			});

			// emit time event to the clients
			socket.on('timeEvent', () => {
				let counter = 7;
				let interval = setInterval(() => {
					counter -= 1;
					// when the time event ends
					if (counter === 0) {
						clearInterval(interval);

						Game.findOne({ game_id: room }, (err, result) => {
							const leftTotal = result.leftUpVotes + result.leftDownVotes;
							const leftPercentage = Math.round(result.leftUpVotes / leftTotal * 100) || 0;
							const rightTotal = result.rightUpVotes + result.trightDownVotes;
							const rightPercentage = Math.round(result.rightUpVotes / rightTotal * 100) || 0;
							console.log(`final percentage: ${leftPercentage} - 0`);

							// handle final scores
							if (leftPercentage > 50 && rightPercentage > 50) {
								leftScore += 1;
								rightScore += 1;
								io.sockets.in(room).emit('leftVoteResult', leftScore);
								io.sockets.in(room).emit('rightVoteResult', rightScore);
							} else if (rightPercentage > 50) {
								rightScore += 1;
								io.sockets.in(room).emit('rightVoteResult', rightScore);
							} else if (leftPercentage > 50) {
								leftScore += 1;
								io.sockets.in(room).emit('leftVoteResult', leftScore);
							} else {
								const obj = {
									leftPercentage: 0,
									rightPercentage: 0
								}
								io.sockets.in(room).emit('percentage', obj);
							}

							console.log(`final score: ${leftScore} - 0`);

							// update the score or not
							Game.findOneAndUpdate({ game_id: room }, 
								{ leftScore: leftScore, rightScore: rightScore, 
									leftUpVotes: 0, 
									leftDownVotes: 0, 
									rightUpVotes: 0, 
									rightDownVotes: 0, 
									leftPercentage: 0, 
									rightPercentage: 0 }, 
								{ upsert: true }, (err, result) => {
								if (err) throw err;
							});
						});
					}

					Game.findOneAndUpdate({ game_id: room }, 
						{ counter: counter }, 
						{ upsert: true }, (err, result) => {
						if (err) throw err;
					});

					io.sockets.in(room).emit('timeStarted', counter);
				}, 1000);
			});
		});
	});
});

// handle routes
app.use('/', routes);

// run the app
server.listen(port, () => {
	console.log(`Running on ${port}`);
});

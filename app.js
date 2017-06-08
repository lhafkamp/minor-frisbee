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
	cookie: { maxAge: 1200000 },
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
			let leftUpVotes = game[0].leftUpVotes;
			let leftDownVotes = game[0].leftDownVotes;
			let rightUpVotes = game[0].rightUpVotes;
			let rightDownVotes = game[0].rightDownVotes;
			
			socket.join(room);
			console.log(`someone entered room: ${room}`);

			// update votes
			socket.on('upVote', (obj) => {
				if (obj.leftUpVotes === 1) {
					leftUpVotes += obj.leftUpVotes;
				} else {
					rightUpVotes += obj.rightUpVotes;
				}

				Game.findOneAndUpdate({ game_id: room }, 
					{ leftUpVotes: leftUpVotes, rightUpVotes: rightUpVotes }, 
					{ upsert: true }, (err, result) => {
					if (err) throw err;
				});

				const leftTotal = leftUpVotes + leftDownVotes;
				const rightTotal = rightUpVotes + rightDownVotes;
				const leftPercentage = Math.round(leftUpVotes / leftTotal * 100) || 0;
				const rightPercentage = Math.round(rightUpVotes / rightTotal * 100) || 0;

				Game.findOneAndUpdate({ game_id: room }, 
					{ leftPercentage: leftPercentage, rightPercentage: rightPercentage }, 
					{ upsert: true }, (err, result) => {
					if (err) throw err;
				});

				console.log(`current score: ${leftPercentage} - ${rightPercentage}`);

				const percentageObj = {
					leftPercentage: leftPercentage,
					rightPercentage: rightPercentage
				}

				io.sockets.in(room).emit('percentage', percentageObj);
			});

			// update votes
			socket.on('downVote', (obj) => {
				if (obj.leftDownVotes === 1) {
					leftDownVotes += obj.leftDownVotes;
				} else {
					rightDownVotes += obj.rightDownVotes;
				}

				Game.findOneAndUpdate({ game_id: room }, 
					{ leftDownVotes: leftDownVotes, rightDownVotes: rightDownVotes }, 
					{ upsert: true }, (err, result) => {
					if (err) throw err;
				});

				const leftTotal = leftUpVotes + leftDownVotes;
				const rightTotal = rightUpVotes + rightDownVotes;
				const leftPercentage = Math.round(leftUpVotes / leftTotal * 100) || 0;
				const rightPercentage = Math.round(rightUpVotes / rightTotal * 100) || 0;

				Game.findOneAndUpdate({ game_id: room }, 
					{ leftPercentage: leftPercentage, rightPercentage: rightPercentage }, 
					{ upsert: true }, (err, result) => {
					if (err) throw err;
				});

				console.log(`current score: ${leftPercentage} - ${rightPercentage}`);

				const percentageObj = {
					leftPercentage: leftPercentage,
					rightPercentage: rightPercentage
				}

				io.sockets.in(room).emit('percentage', percentageObj);
			});

			// emit time event to the clients
			socket.on('timeEvent', () => {
				let counter = 5;
				let interval = setInterval(() => {
					counter -= 1;
					// when the time event ends
					if (counter === 0) {
						clearInterval(interval);
						const leftTotal = leftUpVotes + leftDownVotes;
						const rightTotal = rightUpVotes + rightDownVotes;
						const leftPercentage = Math.round(leftUpVotes / leftTotal * 100) || 0;
						const rightPercentage = Math.round(rightUpVotes / rightTotal * 100) || 0;
						console.log(`final percentage: ${leftPercentage} - ${rightPercentage}`);

						// clear voting process
						leftUpVotes  = 0;
						leftDownVotes = 0;
						rightUpVotes = 0;
						rightDownVotes = 0;

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
							io.sockets.in(room).emit('percentage', 0);
						}

						console.log(`final score: ${leftScore} - ${rightScore}`);

						// update the score or not
						Game.findOneAndUpdate({ game_id: room }, 
							{ leftScore: leftScore, rightScore: rightScore, leftUpVotes: 0, leftDownVotes: 0, rightUpVotes: 0, rightDownVotes: 0, leftPercentage: 0, rightPercentage: 0 }, 
							{ upsert: true }, (err, result) => {
							if (err) throw err;
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
	console.log('Running on http://localhost:3000');
});

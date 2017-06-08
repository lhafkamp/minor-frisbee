const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const gameSchema = new Schema({
	game_id: String,
	score: Number,
	leftUpVotes: Number,
	leftDownVotes: Number,
	rightUpVotes: Number,
	rightDownVotes: Number,
	percentage: Number,
	counter: Number
});

module.exports = mongoose.model('Game', gameSchema);

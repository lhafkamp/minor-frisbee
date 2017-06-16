const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const gameSchema = new Schema({
	game_id: String,
	leftScore: Number,
	rightScore: Number,
	leftUpVotes: Number,
	rightUpVotes: Number,
	leftPercentage: Number,
	rightPercentage: Number,
	counter: Number
});

module.exports = mongoose.model('Game', gameSchema);

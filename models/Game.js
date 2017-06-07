const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const gameSchema = new Schema({
	game_id: String,
	score: Number,
	upVotes: Number,
	downVotes: Number,
	counter: Number
});

module.exports = mongoose.model('Game', gameSchema);

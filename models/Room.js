const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const roomSchema = new Schema({
	room_id: String,
	score: Number,
	upVotes: Number,
	downVotes: Number,
	counter: Number
});

module.exports = mongoose.model('Room', roomSchema);

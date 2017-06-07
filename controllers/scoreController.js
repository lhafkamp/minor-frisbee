const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const request = require('request');

exports.scorePage = (req, res) => {
	const params = req.params.id;
	const gameData = poolData.filter(data => data.id === Number(params));

	Room.find({ room_id: params }, async (err, room) => {
		if (err) throw err;

		if (room.length > 0) {
			console.log('room found');
			redirect();
		} else {
			console.log('new room, creating room..');
			const newRoom = await new Room({
				room_id: params,
				score: 0,
				upVotes: 0,
				downVotes: 0,
				counter: 0
			});

			await newRoom.save((err) => {
				if (err) throw err;
				console.log('new room created!');
				redirect();
			});
		}

		function redirect() {
			res.render('score', {
				teams: gameData,
				score: room[0].score
			});
		}
	});
}

exports.form = (req, res) => {
	// TODO game_id as a variable
	// TODO is_final = true
	const score = {
		"game_id": "199769",
	    "team_1_score": req.body.team_1_score,
	    "team_2_score": req.body.team_2_score,
	    "is_final": "False"
	}

	request({
		url: `http://api.playwithlv.com/v1/game_scores/`,
		method: "POST",
		headers: {
			"Authorization": `bearer ${req.session.token}`
		},
		json: true,
		body: score
	}, (err, response, body) => {
		if (err) {
			console.error('Updating result failed');
		} else {
			console.log('Result updated!');
			res.redirect('/main');
		}
	});
}

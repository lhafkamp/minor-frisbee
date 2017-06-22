const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const request = require('request');

exports.scorePage = (req, res) => {
	const params = req.params.id;
	let admin;

	if (!req.session.token) {
		admin = 'hide';
	}

	Game.find({ game_id: params }, async (err, game) => {
		if (err) throw err;

		console.log('game found');
		res.render('score', {
			game_id: game[0].game_id,
			leftTeam: game[0].leftTeam,
			rightTeam: game[0].rightTeam,
			leftColor: game[0].leftColor,
			rightColor: game[0].rightColor,
			leftScore: game[0].leftScore,
			rightScore: game[0].rightScore,
			leftPercentage: game[0].leftPercentage,
			rightPercentage: game[0].rightPercentage,
			counter: game[0].counter,
			admin: admin
		});
	});
}

exports.form = (req, res) => {
	// TODO is_final = true
	const score = {
		"game_id": req.params.id,
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
			res.redirect('/');
		}
	});
}

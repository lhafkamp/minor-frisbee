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
		let voting;

		console.log(game[0].voting);

		if (game[0].voting === false) {
			voting = 'hide';
		}

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
			admin: admin,
			voting: voting
		});
	});
}

exports.form = async (req, res) => {
	const score = {
		"game_id": req.params.id,
	    "team_1_score": req.body.team_1_score,
	    "team_2_score": req.body.team_2_score,
	    "is_final": "False"
	}

	// update score in DB
	await Game.findOneAndUpdate({ game_id: req.params.id }, 
		{ leftScore: req.body.team_1_score, rightScore: req.body.team_2_score }, 
		{ new: true }, (err, game) => {
		if (err) throw err;
	});

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
			req.flash('update', `${req.params.id}`);
			req.flash('success', 'Score updated!');
			res.redirect('/');
		}
	});
}

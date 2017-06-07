const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const request = require('request');

exports.scorePage = (req, res) => {
	const params = req.params.id;
	const gameData = poolData.filter(data => data.id === Number(params));

	Game.find({ game_id: params }, async (err, game) => {
		if (err) throw err;

		if (game.length > 0) {
			console.log('game found');
			redirectRoom();
		} else {
			console.log('new game, creating game..');
			const newGame = await new Game({
				game_id: params,
				score: 0,
				upVotes: 0,
				downVotes: 0,
				counter: 0
			});

			await newGame.save((err) => {
				if (err) throw err;
				console.log('new game created!');
				redirectNew();
			});
		}

		function redirectNew() {
			res.render('score', {
				teams: gameData,
				score: 0,
				counter: 0
			});
		}

		function redirectRoom() {
			res.render('score', {
				teams: gameData,
				score: game[0].score,
				counter: game[0].counter
			});
		}
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
			res.redirect('/main');
		}
	});
}

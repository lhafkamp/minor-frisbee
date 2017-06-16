const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const request = require('request');

exports.scorePage = (req, res) => {
	const params = req.params.id;
	const gameData = poolData.filter(data => data.id === Number(params));
	let admin;

	if (!req.session.token) {
		admin = 'hide';
	}

	Game.find({ game_id: params }, async (err, game) => {
		if (err) throw err;

		if (game.length > 0) {
			console.log('game found');
			redirectRoom();
		} else {
			console.log('new game, creating game..');
			const newGame = await new Game({
				game_id: params,
				leftScore: 0,
				rightScore: 0,
				leftUpVotes: 0,
				leftDownVotes: 0,
				rightUpVotes: 0,
				rightDownVotes: 0,
				leftPercentage: 0,
				rightPercentage: 0,
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
				leftScore: 0,
				rightScore: 0,
				leftPercentage: 0,
				rightPercentage: 0,
				counter: 0,
				admin: admin
			});
		}

		function redirectRoom() {
			res.render('score', {
				teams: gameData,
				leftScore: game[0].leftScore,
				rightScore: game[0].rightScore,
				leftPercentage: game[0].leftPercentage,
				rightPercentage: game[0].rightPercentage,
				counter: game[0].counter,
				admin: admin
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

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const request = require('request');
const vibrant = require('node-vibrant');

exports.scorePage = (req, res) => {
	const params = req.params.id;
	const gameData = poolData.filter(data => data.id === Number(params));
	let admin;

	if (!req.session.token) {
		admin = 'hide';
	}

	request(`http://api.playwithlv.com/v1/teams/?team_ids=%5B${gameData[0].team_1.id}%2C%20${gameData[0].team_2.id}%5D&access_token=${req.session.token}`, async (err, response, body) => {
		if (err) throw err;
		const data = JSON.parse(body);
		let leftTeamColor;
		let rightTeamColor;
		const teamArray = [];

		data.objects.forEach(team => {
			teamArray.push(team.profile_image_50);
		});

		// extract the main color of the image
		vibrant.from(teamArray[0]).getPalette((err, palette) => {
			try {
				leftTeamColor = palette.Vibrant._rgb;
			} catch(err) {
				console.error(err);
			}
		});

		await vibrant.from(teamArray[1]).getPalette((err, palette) => {
			try {
				rightTeamColor = palette.Vibrant._rgb;
			} catch(err) {
				console.error(err);
			}
		});

		// find game
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
					rightUpVotes: 0,
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
					leftTeamColor: leftTeamColor,
					rightTeamColor: rightTeamColor,
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
					leftTeamColor: leftTeamColor,
					rightTeamColor: rightTeamColor,
					counter: game[0].counter,
					admin: admin
				});
			}
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
			res.redirect('/main');
		}
	});
}

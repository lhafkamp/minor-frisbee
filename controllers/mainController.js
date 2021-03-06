const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const request = require('request');

exports.mainPage = (req, res) => {
	request(`http://api.playwithlv.com/v1/games/?tournament_id=20254&pool_id=20177&access_token=${req.session.token}`, async (err, response, body) => {
		if (err) throw err;

		const data = JSON.parse(body);
		await Game.find({}, (err, games) => {
			if (err) throw err;

			if (games.length < data.objects.length) {
				data.objects.forEach(async (obj) => {

					const newGame = new Game({
						game_id: obj.id,
						leftScore: obj.team_1_score,
						rightScore: obj.team_2_score,
						leftTeam: obj.team_1.name,
						rightTeam: obj.team_2.name,
						leftColor: '#4ADB95',
						rightColor: '#4ADB95',
						leftUpVotes: 0,
						leftDownVotes: 0,
						rightUpVotes: 0,
						rightDownVotes: 0,
						leftPercentage: 0,
						rightPercentage: 0,
						counter: 0,
						voting: false
					});

					await newGame.save((err) => {
						if (err) throw err;
						console.log('new game created!');
					});
				});
			}
		});

		await Game.find({}, (err, games) => {
			res.render('main', {
				games: games
			});
		})
	});
}

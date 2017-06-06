const request = require('request');

exports.mainPage = (req, res) => {
	request(`http://api.playwithlv.com/v1/games/?tournament_id=20254&pool_id=20177&access_token=${req.session.token}`, (err, response, body) => {
		const data = JSON.parse(body);
		global.poolData = data.objects;
		res.render('main', {
			teams: data
		});
	});
}

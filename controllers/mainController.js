const request = require('request');

exports.mainPage = (req, res) => {
	res.render('main');
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
			console.error('Updating scores failed');
		} else {
			console.log('Scores updated!');
		}
	});
}


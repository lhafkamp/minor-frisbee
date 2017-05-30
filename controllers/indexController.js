const request = require('request');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

exports.dev = (req, res) => {
	res.render('test');
}

exports.form = (req, res) => {
	res.json(req.body);
}

exports.homePage = (req, res) => {
	const auth_url = `http://www.playwithlv.com/oauth2/authorize/?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=universal`;
	res.render('index', {
		auth_url
	});
}

exports.authSuccess = (req, res) => {
	request.post({
		url: `http://www.playwithlv.com/oauth2/token`,
		form: {
			client_id: client_id,
			client_secret: client_secret,
			code: req.query.code,
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri
		}
	}, (err, response, body) => {
		if (err) {
			console.error('everything is wrong');
		} else {
			const data = JSON.parse(body);
			req.session.token = data.access_token;

			request(`http://api.playwithlv.com/v1/tournament_teams/?tournament_ids=%5B20059%5D&access_token=${data.access_token}`, (err, response, body) => {
				const data = JSON.parse(body);
				data.objects.forEach(obj => {
					console.log(obj.team.name);
				});
				res.redirect('main');
			});
		}
	});
}

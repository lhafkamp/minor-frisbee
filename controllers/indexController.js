const request = require('request');
require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

exports.homePage = (req, res) => {
	const auth_url = `https://www.leaguevine.com/oauth2/authorize/?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=universal`;
	res.render('index', {
		auth_url
	});
}

exports.authSuccess = (req, res) => {
	request.post({
		url: `https://www.leaguevine.com/oauth2/token`,
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
			console.log(body);

			res.redirect('main');
		}
	});
}

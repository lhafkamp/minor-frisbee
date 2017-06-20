const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const mainController = require('../controllers/mainController');
const scoreController = require('../controllers/scoreController');

router.get('/', mainController.mainPage);

router.get('/admin', authController.homePage);
router.get('/success', authController.authSuccess);

router.get('/score/:id/', scoreController.scorePage);
router.post('/score/:id/result', scoreController.form);

router.get('*', (req, res) => {
	res.render('error');
});

module.exports = router;

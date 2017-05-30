const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const mainController = require('../controllers/mainController');
const scoreController = require('../controllers/scoreController');

router.get('/', authController.homePage);
router.get('/success', authController.authSuccess);

router.get('/main', mainController.mainPage);

router.get('/score', scoreController.scorePage);
router.post('/score/result', scoreController.form);

module.exports = router;

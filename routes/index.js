const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController');
const mainController = require('../controllers/mainController');
const scoreController = require('../controllers/scoreController');

router.get('/', indexController.homePage);
router.get('/success', indexController.authSuccess);

router.get('/main', mainController.mainPage);

router.get('/score', scoreController.scorePage);
router.post('/score/result', scoreController.form);

module.exports = router;

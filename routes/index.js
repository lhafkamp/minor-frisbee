const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const mainController = require('../controllers/mainController');
const scoreController = require('../controllers/scoreController');

router.get('/', authController.homePage);
router.get('/success', authController.authSuccess);

router.get('/main', mainController.mainPage);

router.get('/score/:id/', scoreController.scorePage);
router.post('/score/:id/result', scoreController.form);

module.exports = router;

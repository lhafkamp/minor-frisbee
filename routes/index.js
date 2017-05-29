const express = require('express')
const router = express.Router()
const indexController = require('../controllers/indexController');
const mainController = require('../controllers/mainController');

router.get('/', indexController.homePage);
router.get('/success', indexController.authSuccess);

router.get('/main', mainController.mainPage);

module.exports = router;

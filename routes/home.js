var express = require('express');
var router = express.Router();
var middle=require('../middleware/check_login');
var homeCtrl=require('../controller/home.controller');
/* GET home page. */
router.get('/', middle.request_login,homeCtrl.home);

module.exports = router;

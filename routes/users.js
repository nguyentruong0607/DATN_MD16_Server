var express = require('express');
var router = express.Router();
var UserCtrl= require('../controller/user.controller');
/* GET users listing. */
router.get('/',UserCtrl.getAll);

module.exports = router;

var express = require('express');
var router = express.Router();
var UserCtrl= require('../controller/user.controller');
var checkLogin = require('../middleware/check_login');
/* GET users listing. */
router.get('/',checkLogin.request_login,UserCtrl.getAll);
router.post('/update/:id',UserCtrl.update);
router.get('/search',checkLogin.request_login,UserCtrl.search);
router.get('/getDonHangOfUser/:id',UserCtrl.getDonHangOfUser);
module.exports = router;

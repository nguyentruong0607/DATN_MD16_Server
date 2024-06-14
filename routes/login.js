var express = require('express');
var router = express.Router();
var loginCtrl  = require('../controller/logIn.controller');


// Vào trang home theo địa chỉ '/'
router.get('/login',loginCtrl.login)
router.post('/login' ,loginCtrl.login);


router.get('/logout' , loginCtrl.Logout)
// Xuất router
module.exports = router;
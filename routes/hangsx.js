var express = require('express');
var router = express.Router();
var hangSXCtrl  = require('../controller/hangsx.controller');
var checkLogin=require('../middleware/check_login');

router.get('/',hangSXCtrl.getAll)
router.get('/search',checkLogin.request_login,hangSXCtrl.search);
router.post('/add' ,checkLogin.request_login,hangSXCtrl.addHangsx);

router.get('/update/:id',checkLogin.request_login,hangSXCtrl.updateHangSX);
router.post('/update/:id',checkLogin.request_login,hangSXCtrl.updateHangSX);
router.get('/delete/:id' , hangSXCtrl.deleteHangSX);
// Xuất router
module.exports = router;
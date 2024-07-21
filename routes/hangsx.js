var express = require('express');
var router = express.Router();
var hangSXCtrl  = require('../controller/hangsx.controller');
var checkLogin=require('../middleware/check_login');

router.get('/',checkLogin.request_login,hangSXCtrl.getAll)
router.get('/search',checkLogin.request_login,hangSXCtrl.search);
router.post('/add' ,checkLogin.request_login,hangSXCtrl.addHangsx);
router.get('/trangThai',checkLogin.request_login,hangSXCtrl.getByTrangThai);
router.get('/update/:id',checkLogin.request_login,hangSXCtrl.updateHangSX);
router.post('/update/:id',checkLogin.request_login,hangSXCtrl.updateHangSX);
router.post('/delete/:id' , checkLogin.request_login,hangSXCtrl.deleteHangSX);
router.get('/listSPofHang/:id',checkLogin.request_login,hangSXCtrl.getSanPhamByIdHang);
// Xuất router
module.exports = router;
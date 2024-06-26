var express = require('express');
var router = express.Router();
var sanPhamCtrl  = require('../controller/sanPham.controller');
var checkLogin=require('../middleware/check_login');

router.get('/',checkLogin.request_login,sanPhamCtrl.getAllSP)
router.get('/add',sanPhamCtrl.add);
router.post('/add',sanPhamCtrl.add);
router.get('/search',sanPhamCtrl.search);
// Xuất router
module.exports = router;
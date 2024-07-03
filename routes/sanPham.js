var express = require('express');
var router = express.Router();
var sanPhamCtrl  = require('../controller/sanPham.controller');
var checkLogin=require('../middleware/check_login');
var multer=require('multer');
var spUpload=multer({dest: './tmp'});

router.get('/',checkLogin.request_login,sanPhamCtrl.getAllSP);
router.get('/chi-tiet/:id',checkLogin.request_login,sanPhamCtrl.chiTiet);
router.get('/add',sanPhamCtrl.add);

router.post('/add',spUpload.single('hinhAnh'),sanPhamCtrl.add);
router.get('/search',sanPhamCtrl.search);
// router.get('/edit/:id',sanPhamCtrl.edit);
router.post('/delete/:id',sanPhamCtrl.deleteProduct);
// Xuất router
module.exports = router;
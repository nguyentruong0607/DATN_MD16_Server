var express = require('express');
var router = express.Router();
var sanPhamCtrl  = require('../controller/sanPham.controller');
var checkLogin=require('../middleware/check_login');
var multer=require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',checkLogin.request_login,sanPhamCtrl.getAllSP);
router.get('/chi-tiet/:id',sanPhamCtrl.chiTiet);
router.get('/add',sanPhamCtrl.add);

router.post('/add',upload.any('hinhAnh'),sanPhamCtrl.add);
router.get('/search',sanPhamCtrl.search);
router.get('/edit/:id',sanPhamCtrl.editSP);
router.post('/delete/:id',sanPhamCtrl.deleteProduct);

//màu
router.put('/edit-mau/:productId/:mauId',sanPhamCtrl.updateColor);
// Xuất router
module.exports = router;
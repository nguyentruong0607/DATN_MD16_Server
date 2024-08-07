var express = require('express');
var router = express.Router();
var sanPhamCtrl  = require('../controller/sanPham.controller');
var checkLogin=require('../middleware/check_login');
var multer=require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',checkLogin.request_login,sanPhamCtrl.getAllSP);
router.get('/chi-tiet/:id',checkLogin.request_login,sanPhamCtrl.chiTiet);
router.get('/add',checkLogin.request_login,sanPhamCtrl.add);

router.post('/add',checkLogin.request_login,upload.any('hinhAnh'),sanPhamCtrl.add);
router.get('/search',checkLogin.request_login,sanPhamCtrl.search);
router.get('/edit/:id',checkLogin.request_login,sanPhamCtrl.editSP);
router.post('/delete/:id',sanPhamCtrl.deleteProduct);

//màu
router.get('/add-mau/:id',sanPhamCtrl.addColor)
router.post('/add-mau/:id',upload.none(),sanPhamCtrl.addColor);
router.put('/edit-mau/:productId/:mauId',sanPhamCtrl.updateColor);
// Xuất router
module.exports = router;
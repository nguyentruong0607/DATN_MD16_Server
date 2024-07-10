var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
var sanPhamApi = require('../../controller/api/sanPham.api.controller');
var multer=require('multer');
const storage = multer.memoryStorage();
const spUpload = multer({ storage: storage });
// lấy ds sanPham
router.get('/', sanPhamApi.listsanPham)   ; 
// xem chi tiết 1 sanPham
router.get('/:id', sanPhamApi.getsanPhamById); 
router.post('/add', sanPhamApi.createsanPham); 
router.post('/search',sanPhamApi.searchSanPham);
router.put('/edit/:id',spUpload.any('hinhAnh') ,sanPhamApi.updatesanPham); 
router.delete("/delete/:id",sanPhamApi.deletesanPham);
router.patch('/status/:id',sanPhamApi.toggleProductStatus);


//màu
router.post('/add-mau/:id',sanPhamApi.addColor);
router.put('/edit-mau/:productId/:mauId',sanPhamApi.updateColor);
module.exports=router;
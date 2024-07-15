var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
var sanPhamApi = require('../../controller/api/sanPham.api.controller');
var multer=require('multer');
const { route } = require('./hangSX.api');
const storage = multer.memoryStorage();
const spUpload = multer({ storage: storage });
// lấy ds sanPham
router.get('/', sanPhamApi.listsanPham)   ;
router.get('/new',sanPhamApi.listProductBestNew); 
router.get('/hot',sanPhamApi.listProductHottest);
// xem chi tiết 1 sanPham
router.get('/:id', sanPhamApi.getsanPhamById); 
router.get('/hang/:id',sanPhamApi.getSanPhamByIdHang); 
router.post('/add', sanPhamApi.createsanPham); 
router.post('/search',sanPhamApi.searchSanPham);
router.put('/edit/:id',spUpload.any('hinhAnh') ,sanPhamApi.updatesanPham); 
router.delete("/delete/:id",sanPhamApi.deletesanPham);
router.patch('/status/:id',sanPhamApi.toggleProductStatus);


//màu
router.post('/add-mau/:id',sanPhamApi.addColor);
router.put('/edit-mau/:productId/:mauId',sanPhamApi.updateColor);
module.exports=router;
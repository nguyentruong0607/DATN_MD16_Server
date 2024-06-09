var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
var sanPhamApi = require('../../controller/api/sanPham.api.controller');
// lấy ds sanPham
router.get('/', sanPhamApi.listsanPham)   ; 
// xem chi tiết 1 sanPham
router.get('/:id', sanPhamApi.getsanPhamById); 
router.post('/', sanPhamApi.createsanPham); 
router.put('/:id', sanPhamApi.updatesanPham); 
router.delete("/:id",sanPhamApi.deletesanPham);


module.exports=router;
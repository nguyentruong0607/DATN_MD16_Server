var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
const sanPhamYTCtrl=require('../../controller/api/sanPhamYT.api.controller');

router.get('/',sanPhamYTCtrl.listsanPhamYT);
router.get('/:id',sanPhamYTCtrl.getSanPhamYTById);
// Lấy trạng thái đã yêu thích chưa để hiện thị tym đỏ hay trong suốt 
// khi mới vào màn hình sản phẩm
router.post('/check', sanPhamYTCtrl.checkYeuThich);

// Thêm và xóa sản phẩm yêu thích khi ở màn hình sản phẩm
router.post('/', sanPhamYTCtrl.createsanPhamYT);
//xóa sản phẩm yêu thích ở màn hình danh sách
router.delete('/:id',sanPhamYTCtrl.deletesanPhamYT);
 module.exports=router;
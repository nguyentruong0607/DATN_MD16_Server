var express = require('express');
var router = express.Router();
const gioHangCtrl = require('../../controller/api/gioHang.api.controller');
router.get('/',gioHangCtrl.getAll);
router.get('/:id' , gioHangCtrl.getGioHangByIdAccount);
router.get('/gioHang/:id' , gioHangCtrl.getGioHangByIdGioHang);
router.post('/add' , gioHangCtrl.addGioHang);
router.put('/edit-soLuong/:id' , gioHangCtrl.editSoLuongSanPham);
router.delete('/delete/:id',gioHangCtrl.deleteGioHang);

module.exports = router;
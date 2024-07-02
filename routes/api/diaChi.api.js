var express = require('express');
var router = express.Router();
var diaChiApi = require('../../controller/api/diaChi.api.controller');
// lấy ds 
router.get('/', diaChiApi.listDiaChi)   ; 
// xem chi tiết 
router.get('/:id', diaChiApi.getDiaChiById); 
router.post('/add', diaChiApi.createDiaChi); 
router.put('/edit/:id', diaChiApi.updateDiaChi); 
router.delete('/delete/:id',diaChiApi.deleteDiaChi);


module.exports=router;
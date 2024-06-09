var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
var hangSXApi = require('../../controller/api/hangSX.api.controller');
// lấy ds hangsx
router.get('/', hangSXApi.listHangsx)   ; 
// xem chi tiết 1 hangsx
router.get('/:id', hangSXApi.getHangsxById); 
router.post('/', hangSXApi.createHangSX); 
router.put('/:id', hangSXApi.updateHangsx); 
router.delete('/id:',hangSXApi.deleteHangSX);


module.exports=router;
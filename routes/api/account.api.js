var express = require('express');
var router = express.Router();
const { model } = require('mongoose');
var hangSXApi = require('../../controller/api/account.api.controller');
// lấy ds hangsx
router.get('/', hangSXApi.listAccount)   ; 
// xem chi tiết 1 hangsx
router.get('/:id', hangSXApi.getAccountById); 
router.post('/', hangSXApi.createAccount); 
router.post('/sign-in', hangSXApi.signIn); 
router.post('/sign-up',hangSXApi.SignUp);


module.exports=router;
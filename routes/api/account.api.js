var express = require('express');
var router = express.Router();
var accountApi = require('../../controller/api/account.api.controller');
// lấy ds hangsx
router.get('/', accountApi.listAccount)   ; 
// xem chi tiết 1 hangsx
router.get('/:id', accountApi.getAccountById); 
router.post('/', accountApi.createAccount); 
router.post('/sign-in', accountApi.signIn); 
router.post('/sign-up',accountApi.SignUp);
router.put('/edit-account/:id',accountApi.editAccountInfo);
router.put('/edit-pass/:id',accountApi.editMatKhau);

module.exports=router;
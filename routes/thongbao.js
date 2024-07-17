var express = require('express');
var router = express.Router();

// Đường dẫn tới home.controller.js
var thongbaoCtrl = require('../controller/thongbao.controller');
var middleware= require('../middleware/check_login');
// Vào trang home theo địa chỉ '/'
router.get('/',middleware.request_login,thongbaoCtrl.home);
router.post('/',middleware.request_login,thongbaoCtrl.sendNotification);

// Xuất router
module.exports = router;
var express = require("express");
var router = express.Router();
var donHangCtrl = require("../controller/donHang.controller");
var checkLogin = require("../middleware/check_login");

// Web
router.get("/", checkLogin.request_login, donHangCtrl.getAllKDH);

// Xuất router
module.exports = router;

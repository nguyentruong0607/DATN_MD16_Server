var express = require("express");
var router = express.Router();
var donHangCtrl = require("../controller/donHang.controller");
var checkLogin = require("../middleware/check_login");

// Web
router.get("/", checkLogin.request_login, donHangCtrl.getAllKDH);
router.post("/update/:id", checkLogin.request_login, donHangCtrl.updateDonHang);
router.get("/search", checkLogin.request_login, donHangCtrl.search);

// Xuất router
module.exports = router;

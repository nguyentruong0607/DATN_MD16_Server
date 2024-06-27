var express = require("express");
var router = express.Router();
var khuyenMaiCtrl = require("../controller/khuyenMai.controller");
var checkLogin = require("../middleware/check_login");

router.get("/", checkLogin.request_login, khuyenMaiCtrl.getAllKM);
// router.get('/add',sanPhamCtrl.add);
// router.post('/add',sanPhamCtrl.add);
// router.get('/search',sanPhamCtrl.search);
// Xuất router
module.exports = router;

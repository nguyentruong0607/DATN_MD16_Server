var express = require("express");
var router = express.Router();
var khuyenMaiCtrl = require("../controller/khuyenMai.controller");
var khuyenMaiAPICtrl = require("../controller/api/khuyenMai.api.controller");
var checkLogin = require("../middleware/check_login");

// Web
router.get("/", checkLogin.request_login, khuyenMaiCtrl.getAllKM);
router.post("/add", checkLogin.request_login, khuyenMaiCtrl.createKhuyenMai);
router.post("/update/:id", checkLogin.request_login, khuyenMaiCtrl.updateKM);
router.get("/delete/:id", checkLogin.request_login, khuyenMaiCtrl.deleteKM);

// API
router.post("/updateAPI/:id", khuyenMaiAPICtrl.updateKM);
router.get("/api", khuyenMaiAPICtrl.listKhuyenMai);
router.post("/addAPI", khuyenMaiAPICtrl.createKhuyenMai);
router.delete("/delete/:id", khuyenMaiAPICtrl.deleteKhuyenMai);

// Xuất router
module.exports = router;

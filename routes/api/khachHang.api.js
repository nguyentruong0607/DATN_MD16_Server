var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var khachHangApi = require("../../controller/api/khachHang.api.controller");
router.get("/", khachHangApi.listKhachHang);
router.post("/login", khachHangApi.loginKhachHang);
router.post("/register", khachHangApi.registerKhachHang);
router.delete("/id:", khachHangApi.deleteKhachHang);

module.exports = router;

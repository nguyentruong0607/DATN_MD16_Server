var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var gioHangApi = require("../../controller/api/gioHang.api.controller");
// lấy ds hangsx
router.get("/", gioHangApi.listGioHang);
// xem chi tiết 1 hangsx
router.post("/", gioHangApi.createGioHang);
router.delete("/id:", gioHangApi.deleteGioHang);

module.exports = router;

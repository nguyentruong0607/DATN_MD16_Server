var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var donHangApi = require("../../controller/api/donHang.api.controller");
// lấy ds hangsx
router.get("/", donHangApi.listDonHang);
// xem chi tiết 1 hangsx
router.post("/", donHangApi.createDonHang);
router.delete("/id:", donHangApi.deleteDonHang);

module.exports = router;

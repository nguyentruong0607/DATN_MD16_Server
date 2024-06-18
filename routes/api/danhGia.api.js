var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var danhGiaApi = require("../../controller/api/danhGia.api.controller");
// lấy ds hangsx
router.get("/", danhGiaApi.listDanhGia);
// xem chi tiết 1 hangsx
router.post("/", danhGiaApi.createDanhGia);
router.delete("/id:", danhGiaApi.deleteDanhGia);

module.exports = router;

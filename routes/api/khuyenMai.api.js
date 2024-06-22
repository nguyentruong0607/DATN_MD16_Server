var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var khuyenMaiApi = require("../../controller/api/khuyenMai.api.controller");
router.get("/", khuyenMaiApi.listKhuyenMai);
router.post("/", khuyenMaiApi.createKhuyenMai);
router.delete("/id:", khuyenMaiApi.deleteKhuyenMai);

module.exports = router;

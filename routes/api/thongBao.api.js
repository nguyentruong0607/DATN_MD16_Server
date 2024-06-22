var express = require("express");
var router = express.Router();
const { model } = require("mongoose");
var thongBaoApi = require("../../controller/api/thongBao.api.controller");
router.get("/", thongBaoApi.listThongBao);
router.post("/", thongBaoApi.createThongBao);
router.delete("/id:", thongBaoApi.deleteThongBao);

module.exports = router;

const mongoose = require('mongoose');
var danhGiaSchema = new mongoose.Schema(
  {
    noiDung: {
      type: String,
      required: true,
    },
    thoiGian: {
      type: String,
      required: true,
    },
    diemDanhGia: {
      type: Number,
      required: true,
    },
    idKH: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "khachHang",
      required: true,
    },
    idSP: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
    },
  },
  {
    collection: "DanhGia",
  }
);

let danhGiaModel = mongoose.model("DanhGia", danhGiaSchema);
module.exports =  danhGiaModel ;

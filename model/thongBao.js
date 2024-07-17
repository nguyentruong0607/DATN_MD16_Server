const mongoose = require('mongoose');
var thongBaoSchema = new mongoose.Schema(
  {
    idDonHang: String,
    idSanPham: String,
    idAccount: String,
    tieuDe: String,
    noiDung: String,
    daXem: Boolean,
    thoiGian: { type: Date, default: Date.now }
  },
  {
    collection: "thongBao",
  }
);
let thongBaoModel = mongoose.model("thongBaoModel", thongBaoSchema);
module.exports = thongBaoModel;

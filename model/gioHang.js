const mongoose = require("mongoose");
const GioHangSchema = new mongoose.Schema(
  {
    idSanPham: { type: mongoose.Schema.Types.ObjectId, ref: "DienThoai" },
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accountModel",
    },
    soLuong: Number,
    idMau: String,
  },
  {
    collection: "GioHang_Table",
  }
);

const GioHang = mongoose.model("GioHang", GioHangSchema);
module.exports = GioHang;

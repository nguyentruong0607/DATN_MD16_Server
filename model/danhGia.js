const { head } = require("../routes");
var db = require("./db");

var danhGiaSchema = new db.mongoose.Schema(
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
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "khachHang",
      required: true,
    },
    idSP: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
    },
  },
  {
    collection: "DanhGia",
  }
);

let danhGiaModel = db.mongoose.model("DanhGia", danhGiaSchema);
module.exports = { danhGiaModel };

const mongoose = require("mongoose");

// Mau Schema
const mauSchema = new mongoose.Schema({
  mau: String,
  soLuong: Number,
  giaTien: Number,
});

// DienThoai Schema
const dienThoaiSchema = new mongoose.Schema(
  {
    tenDienThoai: String,
    camera: String,
    cameraTruoc: String,
    kichThuoc: String,
    cPU: String,
    ram: String,
    sim: String,
    pin: String,
    heDieuHanh: String,
    namSanXuat: String,
    congNgheManHinh: String,
    moTaThem: String,
    hinhAnh: String,
    doPhanGiai: String,
    giamGia: String,
    trangThai: Boolean,

    mauSchema: [mauSchema],
    idHangSX: { type: mongoose.Schema.Types.ObjectId, ref: "hangsxModel" },
  },
  {
    collection: "DienThoai",
  }
);
const DienThoai = mongoose.model("DienThoai", dienThoaiSchema);

module.exports = { DienThoai, dienThoaiSchema };

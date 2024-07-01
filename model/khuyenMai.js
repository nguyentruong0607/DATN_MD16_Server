const mongoose = require("mongoose");
var khuyenMaiSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
    },
    ngayBatDau: {
      type: String,
      required: true,
    },
    ngayKetThuc: {
      type: String,
      required: true,
    },
    soLuong: {
      type: Number,
      required: true,
    },
    giaKhoiDiem: {
      type: Number,
      required: true,
    },
    soLanApDung: {
      type: Number,
      required: true,
    },
    trangThai: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "khuyenMai",
  }
);
let khuyenMaiModel = mongoose.model("khuyenMaiModel", khuyenMaiSchema);
module.exports = khuyenMaiModel;

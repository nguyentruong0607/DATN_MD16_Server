const mongoose = require('mongoose');
var khuyenMaiSchema = new mongoose.Schema(
  {
    giamGia: {
      type: Number,
      required: true,
    },
    thoiGian: {
      type: String,
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
module.exports =  khuyenMaiModel ;

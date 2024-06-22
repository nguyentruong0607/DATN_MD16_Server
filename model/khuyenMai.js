var db = require("./db");

var khuyenMaiSchema = new db.mongoose.Schema(
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
    collection: "KhuyenMai",
  }
);
let khuyenMaiModel = db.mongoose.model("KhuyenMai", khuyenMaiSchema);
module.exports = { khuyenMaiModel };

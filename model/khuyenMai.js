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
    collection: "khuyenMai",
  }
);
let khuyenMaiModel = db.mongoose.model("khuyenMaiModel", khuyenMaiSchema);
module.exports = { khuyenMaiModel };

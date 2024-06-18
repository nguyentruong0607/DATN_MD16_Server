const { head } = require("../routes");
var db = require("./db");

var gioHangSchema = new db.mongoose.Schema(
  {
    soLuong: {
      type: Number,
      required: true,
    },
    tongTien: {
      type: Number,
      required: true,
    },
    idKH: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "khachHang",
      required: true,
    },
  },
  {
    collection: "GioHang",
  }
);

let gioHangModel = db.mongoose.model("GioHang", gioHangSchema);
module.exports = { gioHangModel };

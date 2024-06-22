const { head } = require("../routes");
var db = require("./db");

var donHangSchema = new db.mongoose.Schema(
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
      ref: "KhachHang",
      required: true,
    },
  },
  {
    collection: "DonHang",
  }
);

let donHangModel = db.mongoose.model("DonHang", donHangSchema);
module.exports = { donHangModel };

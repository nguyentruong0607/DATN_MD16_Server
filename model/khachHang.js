const { head } = require("../routes");
var db = require("./db");

var khachHangSchema = new db.mongoose.Schema(
  {
    tenDN: {
      type: String,
      required: true,
      unique: true,
    },
    matKhau: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
      required: true,
    },
    hoVaTen: {
      type: String,
      required: true,
    },
  },
  {
    collection: "KhachHang",
  }
);

let khachHangModel = db.mongoose.model("KhachHang", khachHangSchema);
module.exports = { khachHangModel };

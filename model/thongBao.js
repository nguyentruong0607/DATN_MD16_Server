var db = require("./db");

var thongBaoSchema = new db.mongoose.Schema(
  {
    noiDung: {
      type: String,
      required: true,
    },
    thoiGian: {
      type: String,
      required: true,
    },
    idKH: {
      type: db.mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    collection: "ThongBao",
  }
);
let thongBaoModel = db.mongoose.model("ThongBao", thongBaoSchema);
module.exports = { thongBaoModel };

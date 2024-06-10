var db = require("./db");

var thongBaoSchema = new db.mongoose.Schema(
  {
    noiDung: {
      type: String,
      required: true,
    },
  },
  {
    collection: "thongBao",
  }
);
let thongBaoModel = db.mongoose.model("thongBaoModel", thongBaoSchema);
module.exports = { thongBaoModel };

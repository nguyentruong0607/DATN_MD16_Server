const mongoose = require('mongoose');
var thongBaoSchema = new mongoose.Schema(
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
let thongBaoModel = mongoose.model("thongBaoModel", thongBaoSchema);
module.exports =  thongBaoModel ;

const mongoose = require('mongoose');

var donHangSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    collection: "DonHang",
  }
);

let donHangModel = mongoose.model("DonHang", donHangSchema);
module.exports =  donHangModel ;

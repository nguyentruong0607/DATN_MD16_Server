const mongoose = require("mongoose");
var diaChiSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
    },
    diaChi: {
      type: String,
    },
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    collection: "DiaChi",
  }
);
let diaChiModel = mongoose.model("diaChiModel", diaChiSchema);
module.exports = diaChiModel;

const mongoose = require("mongoose");

var accountSchema = new mongoose.Schema(
  {
    taiKhoan: {
      type: String,
      required: true,
    },
    hoTen: {
      type: String,
      required: true,
    },
    matKhau: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
      required: true,
    },
    tenQuyen: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    trangThai:{
      type:Boolean,
      default:"true"
    }
  },
  {
    collection: "Account",
  }
);
let accountModel = mongoose.model("Account", accountSchema);
module.exports = accountModel;

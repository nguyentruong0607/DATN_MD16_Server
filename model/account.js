var db = require("./db");

var accountSchema = new db.mongoose.Schema(
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
  },
  {
    collection: "Account",
  }
);
let accountModel = db.mongoose.model("Account", accountSchema);
module.exports = { accountModel };

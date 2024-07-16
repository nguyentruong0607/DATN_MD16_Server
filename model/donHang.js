const mongoose = require("mongoose");

var donHangSchema = new mongoose.Schema(
  {
    idSP: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DienThoai",
      },
    ],
    idKM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KhuyenMai",
    },

    soLuong: {
      type: Number,
      min: 1,
    },
    tongTien: {
      type: Number,
      min: 0,
    },
    trangThaiThanhToan: {
      type: Boolean,
      default: false,
    },
    ghiChu: {
      type: String,
      default: false,
    },
    idKH: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    ngayDatHang: {
      type: Date,
      default: Date.now,
    },
    ngayNhanHang: {
      type: Date,
      default: Date.now,
    },
    diaChiGiaoHang: {
      type: String,
    },
    trangThaiDonHang: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đang xử lý",
        "Đang giao hàng",
        "Đã giao hàng",
        "Đã hủy",
      ],
      default: "Đang xử lý",
    },
    phuongThucThanhToan: {
      type: String,
      enum: ["Tiền mặt", "Thẻ tín dụng", "Chuyển khoản"],
      default: "Tiền mặt",
    },
  },
  {
    collection: "DonHang",
  }
);

let donHangModel = mongoose.model("DonHang", donHangSchema);
module.exports = donHangModel;

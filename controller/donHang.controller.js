const donHangModel = require("../model/donHang");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Hiển thị danh sách khuyến mãi
exports.getAllKDH = async (req, res, next) => {
  try {
    const donHang = await donHangModel.find().populate("idKH").populate("idSP");
    res.render("donHang/list", {
      listDH: donHang,
      msg: "Lấy dữ liệu thành công !",
      title: "Đơn hàng",
    });
  } catch (error) {
    console.error("Error in getAllDH:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu đơn hàng" });
  }
};

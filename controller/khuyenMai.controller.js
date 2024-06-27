const khuyenMai = require("../model/khuyenMai");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Hiển thị danh sách khuyến mãi
exports.getAllKM = async (req, res, next) => {
  try {
    const list = await khuyenMai.find();
    res.render("khuyenMai/list", {
      listKM: list,
      msg: "Lấy dữ liệu thành công !",
      title: "Khuyến Mại",
    });
  } catch (error) {
    console.error("Error in getAllKM:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu khuyến mại" });
  }
};

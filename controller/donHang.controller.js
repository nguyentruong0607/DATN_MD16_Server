const donHangModel = require("../model/donHang");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Hiển thị danh sách Đơn hàng
exports.getAllKDH = async (req, res, next) => {
  try {
    const donHang = await donHangModel.find().populate("idKH").populate({
      path: "sp.idSP",
      model: "DienThoai",
    });
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

// Cập nhật trạng thái đơn hàng
exports.updateDonHang = async (req, res, next) => {
  try {
    const trangThaiDonHang = req.body.trangThaiDonHang;

    // Cập nhật trạng thái đơn hàng dựa trên ID của đơn hàng
    const updatedDonHang = await donHangModel.findByIdAndUpdate(
      req.params.id,
      { trangThaiDonHang: trangThaiDonHang },
      { new: true }
    );

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!updatedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    return res.redirect("/donHang");
  } catch (error) {
    console.error("Error in updateDonHang:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng" });
  }
};

exports.search = async (req, res, next) => {
  try {
    const dh = req.session.DonHang;
    let queryValue = req.query.query;

    if (!queryValue || queryValue.length === 0) {
      let listDH = await donHangModel.find().populate("idKH").populate({
        path: "sp.idSP",
        model: "DienThoai",
      });
      return res.render("donHang/list", {
        title: "Đơn hàng",
        listDH: listDH,
        dh: dh,
      });
    }

    let listDH = await donHangModel
      .find()
      .populate({
        path: "idKH",
        match: { hoTen: { $regex: queryValue, $options: "i" } },
      })
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      });

    listDH = listDH.filter((dh) => dh.idKH !== null);

    res.render("donHang/list", {
      title: "Đơn hàng: '" + queryValue + "'",
      listDH: listDH,
      dh: dh,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.selectTrangThai = async (req, res, next) => {
  try {
    const { trangThaiDonHang } = req.query;

    if (typeof trangThaiDonHang === "undefined") {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const listDH = await donHangModel
      .find({
        trangThaiDonHang: trangThaiDonHang,
      })
      .find()
      .populate("idKH")
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      });

    res.render("donHang/list", {
      title: `Đơn hàng trạng thái: ${trangThaiDonHang}`,
      listDH: listDH,
      msg: `Lấy danh sách Đơn hàng trạng thái: ${trangThaiDonHang} thành công!`,
    });
  } catch (error) {
    console.error("Error in selectTrangThai:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách đơn hàng theo trạng thái" });
  }
};

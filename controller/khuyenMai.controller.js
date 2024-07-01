const khuyenMaiModel = require("../model/khuyenMai");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Hiển thị danh sách khuyến mãi
exports.getAllKM = async (req, res, next) => {
  try {
    const list = await khuyenMaiModel.find();
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

exports.createKhuyenMai = async (req, res, next) => {
  let msg = "";
  let ngayBatDau = req.body.ngayBatDau;
  let ngayKetThuc = req.body.ngayKetThuc;
  let ten = req.body.ten;
  let giaKhoiDiem = req.body.giaKhoiDiem;
  let soLuong = req.body.soLuong;
  let soLanApDung = 0;
  let trangThai = true;

  try {
    let addFields = {
      ten: ten,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      giaKhoiDiem: giaKhoiDiem,
      soLuong: soLuong,
      soLanApDung: soLanApDung,
      trangThai: trangThai,
    };

    let addItems = await khuyenMaiModel.create(addFields);

    msg = "Thêm thành công";
    res.redirect("/khuyenMai");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }

  res.render("khuyenMai/list", { msg: msg });
};

exports.updateKM = async (req, res, next) => {
  try {
    let msg = "";
    const _id = req.params._id;
    const {
      ngayBatDau,
      ngayKetThuc,
      ten,
      giaKhoiDiem,
      soLuong,
      soLanApDung,
      trangThai,
    } = req.body;

    const updatedFields = {
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      ten: ten,
      giaKhoiDiem: giaKhoiDiem,
      soLuong: soLuong,
      soLanApDung: soLanApDung,
      trangThai: trangThai,
    };

    const updatedItem = await khuyenMaiModel.findOneAndUpdate(
      { _id: _id },
      updatedFields,
      { new: true }
    );

    msg = "Cập nhật thành công";
    res.redirect("/khuyenMai");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

  res.render("khuyenMai/list", { msg: msg });
};

// Xóa
exports.deleteKM = async (req, res, next) => {
  let id_c = req.params.id;
  let msg = "";
  try {
    await hangSX.findByIdAndDelete(id_c);
    msg = "Xóa thành công";
    return res.redirect("/khuyenMai");
  } catch (error) {
    msg = error.message;
    res.render("khuyenMai/list", { msg: msg });
  }
};

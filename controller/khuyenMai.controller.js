const khuyenMaiModel = require("../model/khuyenMai");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Hiển thị danh sách khuyến mãi
exports.getAllKM = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 6;
  const skip = (page - 1) * perPage;
  try {
    const totalItems = await khuyenMaiModel.countDocuments();

    const list = await khuyenMaiModel.find().skip(skip).limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);

    res.render("khuyenMai/list", {
      listKM: list,
      msg: "Lấy dữ liệu thành công !",
      title: "Khuyến Mại",
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      perPage,
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
  let giaToiDa = req.body.giaToiDa;
  let phanTramGiamGia = req.body.phanTramGiamGia;
  let giaKhuyenMaiToiDa = req.body.giaKhuyenMaiToiDa;
  let soLuong = req.body.soLuong;
  let soLanApDung = 0;
  let trangThai = true;

  try {
    let addFields = {
      ten: ten,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      giaKhoiDiem: giaKhoiDiem,
      giaToiDa: giaToiDa,
      giaKhuyenMaiToiDa: giaKhuyenMaiToiDa,
      phanTramGiamGia: phanTramGiamGia,
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
};

exports.updateKM = async (req, res, next) => {
  let msg = "";
  try {
    const _id = req.params.id;
    const {
      ngayBatDau,
      ngayKetThuc,
      ten,
      giaKhoiDiem,
      giaToiDa,
      giaKhuyenMaiToiDa,
      phanTramGiamGia,
      soLuong,
    } = req.body;

    const khuyenMai = await khuyenMaiModel.findById(_id);
    if (!khuyenMai) {
      return res.status(404).json({ message: "Khuyến mại không tồn tại" });
    }

    const updatedFields = {
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      ten: ten,
      giaKhoiDiem: giaKhoiDiem,
      giaToiDa: giaToiDa,
      giaKhuyenMaiToiDa: giaKhuyenMaiToiDa,
      phanTramGiamGia: phanTramGiamGia,
      soLuong: soLuong,
      soLanApDung: khuyenMai.soLanApDung,
      trangThai: khuyenMai.trangThai,
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
};

// Xóa
exports.deleteKM = async (req, res, next) => {
  let id_c = req.params.id;
  let msg = "";
  try {
    await khuyenMaiModel.findByIdAndDelete(id_c);
    msg = "Xóa thành công";
    return res.redirect("/khuyenMai");
  } catch (error) {
    msg = error.message;
    res.render("khuyenMai/list", { msg: msg });
  }
};

exports.search = async (req, res, next) => {
  try {
    const km = req.session.KhuyenMai;
    let queryValue = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;
    if (!queryValue || queryValue.length === 0) {
      const totalItems = await khuyenMaiModel.countDocuments();
      let listKM = await khuyenMaiModel.find().skip(skip).limit(perPage);
      const totalPages = Math.ceil(totalItems / perPage);
      res.render("khuyenMai/list", {
        title: "Khuyến mãi",
        listKM: listKM,
        km: km,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        perPage,
      });
    }
    let listKM = [];
    let filter = {};
    if (queryValue.length > 0) {
      filter.ten = { $regex: queryValue, $options: "i" };
    }
    const totalItems = await khuyenMaiModel.countDocuments(filter);

    listKM = await khuyenMaiModel.find(filter).skip(skip).limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);
    res.render("khuyenMai/list", {
      title: "Khuyến mãi'" + queryValue + "'",
      listKM: listKM,
      km: km,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      perPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.selectTrangThai = async (req, res, next) => {
  try {
    const { trangThai } = req.query;

    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    let filter = {};
    if (trangThai !== "") {
      filter.trangThai = trangThai === "true";
    }
    const totalItems = await khuyenMaiModel.countDocuments(filter);

    const listKM = await khuyenMaiModel.find(filter).skip(skip).limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);

    res.render("khuyenMai/list", {
      title: `Khuyến mãi trạng thái: ${trangThai}`,
      listKM: listKM,
      msg: `Lấy danh sách khuyến mãi trạng thái: ${trangThai} thành công!`,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      perPage,
    });
  } catch (error) {
    console.error("Error in selectTrangThai:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách khuyến mãi theo trạng thái" });
  }
};

exports.updateTrangThai = async (req, res, next) => {
  let msg = "";
  try {
    const _id = req.params.id;
    const { trangThai } = req.body;

    const khuyenMai = await khuyenMaiModel.findById(_id);
    if (!khuyenMai) {
      return res.status(404).json({ message: "Khuyến mại không tồn tại" });
    }

    const updatedFields = {
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
};

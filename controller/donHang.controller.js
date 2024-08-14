const donHangModel = require("../model/donHang");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
const thongBaoModel = require("../model/thongBao");
const User = require("../model/account");

// Hiển thị danh sách Đơn hàng
exports.getAllKDH = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 6;
  const skip = (page - 1) * perPage;
  try {
    const totalItems = await donHangModel.countDocuments();
    const donHang = await donHangModel
      .find()
      .populate("idKH")
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      })
      .skip(skip)
      .limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);
    res.render("donHang/list", {
      listDH: donHang,
      msg: "Lấy dữ liệu thành công !",
      title: "Đơn hàng",
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      perPage,
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

    let tieuDe;
    let noiDung;

    switch (trangThaiDonHang) {
      case "Đang xử lý":
        tieuDe = "Đơn hàng đang xử lý!";
        noiDung = `Đơn hàng của bạn đang được xử lý. Mã đơn hàng: ${updatedDonHang._id}.`;
        break;
      case "Đang giao hàng":
        tieuDe = "Đơn hàng đang được giao!";
        noiDung = `Đơn hàng của bạn đang được giao. Mã đơn hàng: ${updatedDonHang._id}.`;
        break;
      case "Đã giao hàng":
        tieuDe = "Đơn hàng đã được giao!";
        noiDung = `Đơn hàng của bạn đã được giao thành công. Mã đơn hàng: ${updatedDonHang._id}.`;
        break;
      case "Đã hủy":
        tieuDe = "Đơn hàng đã bị hủy!";
        noiDung = `Đơn hàng của bạn đã bị hủy. Mã đơn hàng: ${updatedDonHang._id}.`;
        break;
      default:
        tieuDe = "Cập nhật đơn hàng";
        noiDung = `Đơn hàng của bạn đã được cập nhật. Mã đơn hàng: ${updatedDonHang._id}.`;
        break;
    }

    // Tạo thông báo cho khách hàng
    await thongBaoModel.create({
      idDonHang: updatedDonHang._id,
      idAccount: updatedDonHang.idKH,
      tieuDe: tieuDe,
      noiDung: noiDung,
    });

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
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    if (!queryValue || queryValue.length === 0) {
      const totalItems = await donHangModel.countDocuments();
      let listDH = await donHangModel
        .find()
        .populate("idKH")
        .populate({
          path: "sp.idSP",
          model: "DienThoai",
        })
        .skip(skip)
        .limit(perPage);
      const totalPages = Math.ceil(totalItems / perPage);
      return res.render("donHang/list", {
        title: "Đơn hàng",
        listDH: listDH,
        dh: dh,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        perPage,
      });
    }

    let filter = {};
    if (queryValue.length > 0) {
      filter["idKH"] = {
        $in: await User.find({
          hoTen: { $regex: queryValue, $options: "i" },
        }).select("_id"), // Chỉ lấy `_id` của các khách hàng khớp với điều kiện
      };
    }

    const totalItems = await donHangModel.countDocuments(filter);
    let listDH = await donHangModel
      .find(filter)
      .populate({
        path: "idKH",
      })
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      })
      .skip(skip)
      .limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);
    listDH = listDH.filter((dh) => dh.idKH !== null);

    res.render("donHang/list", {
      title: "Đơn hàng: '" + queryValue + "'",
      listDH: listDH,
      dh: dh,
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
    const { trangThaiDonHang } = req.query;
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;
    let filter = {};
    if (trangThaiDonHang) {
      filter.trangThaiDonHang = { $regex: trangThaiDonHang, $options: "i" };
    }

    const totalItems = await donHangModel.countDocuments(filter);
    const listDH = await donHangModel
      .find(filter)
      .populate("idKH")
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      })
      .skip(skip)
      .limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);

    res.render("donHang/list", {
      title: `Đơn hàng trạng thái: ${trangThaiDonHang}`,
      listDH: listDH,
      msg: `Lấy danh sách Đơn hàng trạng thái: ${trangThaiDonHang} thành công!`,
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
      .json({ message: "Lỗi khi lấy danh sách đơn hàng theo trạng thái" });
  }
};

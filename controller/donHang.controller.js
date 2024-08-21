const donHangModel = require("../model/donHang");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
const { DienThoai } = require("../model/sanPham");
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
      .sort({ ngayDatHang: -1 })
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
    const { trangThaiDonHang, ngayNhanHang } = req.body;

    const updateData = { trangThaiDonHang };
    if (ngayNhanHang) {
      updateData.ngayNhanHang = ngayNhanHang;
    }

    const updatedDonHang = await donHangModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!updatedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Nếu trạng thái đơn hàng là 'Đã giao hàng', cập nhật trạng thái thanh toán
    if (trangThaiDonHang === "Đã giao hàng") {
      await donHangModel.findByIdAndUpdate(
        req.params.id,
        { trangThaiThanhToan: true, ngayNhanHang: new Date() },
        { new: true }
      );
    }

    let tieuDe;
    let noiDung;

    const donHang = await donHangModel
      .findById(req.params.id)
      .populate("sp.idSP");

    const tenDienThoai = donHang.sp.map((item) => item.idSP.tenDienThoai);

    const formatDate = (date) => {
      const d = new Date(date);
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    switch (trangThaiDonHang) {
      case "Đang xử lý":
        tieuDe = "Đơn hàng đã được xác nhận và đang xử lý!";
        noiDung = `Đơn hàng của bạn đã được xác nhận và đang trong thời gian xử lý. Ngày nhận hàng dự kiến là ${
          ngayNhanHang
            ? formatDate(updatedDonHang.ngayNhanHang)
            : "không xác định"
        }. Mã đơn hàng: ${updatedDonHang._id}. Sản phẩm: ${tenDienThoai.join(
          ", "
        )}.`;
        break;
      case "Đang giao hàng":
        tieuDe = "Đơn hàng đang được giao!";
        noiDung = `Đơn hàng của bạn đang được giao. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã giao hàng":
        tieuDe = "Đơn hàng đã được giao!";
        noiDung = `Đơn hàng của bạn đã được giao thành công. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã hủy":
        tieuDe = "Đơn hàng đã bị hủy!";
        noiDung = `Đơn hàng của bạn đã bị hủy. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;

        // Hoàn lại số lượng sản phẩm khi đơn hàng bị hủy
        for (const item of updatedDonHang.sp) {
          const dienThoai = await DienThoai.findById(item.idSP);

          if (dienThoai) {
            const selectedMau = dienThoai.mauSchema.find(
              (mau) => mau._id.toString() === item.idMau.toString()
            );

            if (selectedMau) {
              selectedMau.soLuong += item.soLuong;
              await dienThoai.save();
            } else {
              return res
                .status(400)
                .json({ message: `Không tìm thấy màu với id ${item.idMau}` });
            }
          } else {
            return res
              .status(400)
              .json({ message: `Không tìm thấy sản phẩm với id ${item.idSP}` });
          }
        }

        break;
      default:
        tieuDe = "Cập nhật đơn hàng";
        noiDung = `Đơn hàng của bạn đã được cập nhật. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
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

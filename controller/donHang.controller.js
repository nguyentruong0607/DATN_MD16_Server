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
    const totalItems = await donHangModel.countDocuments(); // Lấy tất cả số lượng bản ghi trong donHangModel
    const donHang = await donHangModel
      .find() // Tiến hành getAll donHang
      .populate("idKH") // Lấy ra tất cả thông tin của KH với idKH
      .populate({
        path: "sp.idSP", // Lấy ra tất cả thông tin của dien thaoi với IdSP
        model: "DienThoai",
      })
      .sort({ ngayDatHang: -1 }) // Sắp xếp những đơne hàng mới nhất lên đầu
      .skip(skip)
      .limit(perPage);
    const totalPages = Math.ceil(totalItems / perPage);
    res.render("donHang/list", {
      listDH: donHang, // truyền listDH lấy được ra bên ngoài view để hiển thị data
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
    const { trangThaiDonHang, ngayNhanHang } = req.body; // Tiến hành update dơn hàng theo trạng thái đơn hàng hoặc ngayNhanHang

    const updateData = { trangThaiDonHang }; // Mặc định trạng thái đơn hàng sẽ được truyền vào
    if (ngayNhanHang) {
      // nếu ngày nhận hàng được truyền vào
      updateData.ngayNhanHang = ngayNhanHang; // thì updateData có thêm ngày nhận hàng
    }

    const updatedDonHang = await donHangModel.findByIdAndUpdate(
      req.params.id,
      updateData, // Tiến hành update đơn hàng theo updateData đã được truyền vào
      { new: true }
    );

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!updatedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Nếu trạng thái đơn hàng là 'Đã giao hàng'
    if (trangThaiDonHang === "Đã giao hàng") {
      await donHangModel.findByIdAndUpdate(
        req.params.id,
        { trangThaiThanhToan: true, ngayNhanHang: new Date() }, // cập nhật trạng thái thanh toán là đã thanh toán và ngày nhận hàng là ngày hiện tại
        { new: true }
      );
    }

    let tieuDe;
    let noiDung;

    const donHang = await donHangModel // Tiến hành tìm đơn hàng theo Id
      .findById(req.params.id)
      .populate("sp.idSP"); // Lấy hết thông tin của điện thoại qua idSP

    const tenDienThoai = donHang.sp.map((item) => item.idSP.tenDienThoai); // Lấy hết tất cả tên điện thoại có trong đơn hàng vào trong mảng tenDienThoai

    const formatDate = (date) => {
      const d = new Date(date);
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }; // Hàm formatDate để hiển thị data theo định dạng dd/MM/YYYY ví dụ: 20/03/2024

    switch (trangThaiDonHang) {
      case "Đang xử lý": // Gửi thông báo nếu trạng thái đơn hàng là đang xử lý
        tieuDe = "Đơn hàng đã được xác nhận và đang xử lý!";
        noiDung = `Đơn hàng của bạn đã được xác nhận và đang trong thời gian xử lý. Ngày nhận hàng dự kiến là ${
          ngayNhanHang
            ? formatDate(updatedDonHang.ngayNhanHang)
            : "không xác định"
        }. Mã đơn hàng: ${updatedDonHang._id}. Sản phẩm: ${tenDienThoai.join(
          ", "
        )}.`;
        break;
      case "Đang giao hàng": // Gửi thông báo nếu trạng thái đơn hàng là đang giao hàng
        tieuDe = "Đơn hàng đang được giao!";
        noiDung = `Đơn hàng của bạn đang được giao. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã giao hàng": // Gửi thông báo nếu trạng thái đơn hàng là đã giao hàng thành công
        tieuDe = "Đơn hàng đã được giao!";
        noiDung = `Đơn hàng của bạn đã được giao thành công. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;
        break;
      case "Đã hủy": // Gửi thông báo nếu trạng thái đơn hàng là đã hủy
        tieuDe = "Đơn hàng đã bị hủy!";
        noiDung = `Đơn hàng của bạn đã bị hủy. Mã đơn hàng: ${
          updatedDonHang._id
        }. Sản phẩm: ${tenDienThoai.join(", ")}.`;

        // Hoàn lại số lượng sản phẩm khi đơn hàng bị hủy
        for (const item of updatedDonHang.sp) {
          // Lặp trong mảng sp
          const dienThoai = await DienThoai.findById(item.idSP); // Tìm điện thoại tương ứng với idSP

          if (dienThoai) {
            // Nếu ddienj thoại được tìm thấy
            const selectedMau = dienThoai.mauSchema.find(
              // Tiến hành tìm màu của chiếc điện thoại đó với idMau tương ứng
              (mau) => mau._id.toString() === item.idMau.toString()
            );

            if (selectedMau) {
              // Nếu màu được tìm thấy
              selectedMau.soLuong += item.soLuong; // Tiến hành update lại số lượng sản phẩm có màu đó + với số lượng sản phẩm có trong đơn hàng vì đơn hàng đã bị hủy thì cần update lại số lượng sản phẩm
              await dienThoai.save(); // Tiến hành update lại điện thoại
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
      // tiến hành tạo thông báo
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
    let queryValue = req.query.query; // Đấy là đoạn text được truyền vào khi người dùng nhập và nhấn tìm kiếm
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    if (!queryValue || queryValue.length === 0) {
      // Nếu người dùng không nhập gì mà vẫn bấm tìm kiếm
      const totalItems = await donHangModel.countDocuments();
      let listDH = await donHangModel
        .find() // Thì lấy ra tất cả đơn hàng
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
        listDH: listDH, // truyền listDh ra view để hiển thị lên view
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
      // Nếu người dùng nhập và nhấn tìm kiếm
      filter["idKH"] = {
        $in: await User.find({
          hoTen: { $regex: queryValue, $options: "i" }, // tiến hành chỉ tìm kiếm theo tên KH
        }).select("_id"), // Chỉ lấy `_id` của các khách hàng khớp với điều kiện,
      };
    }

    const totalItems = await donHangModel.countDocuments(filter);
    let listDH = await donHangModel
      .find(filter) // truyền điều kiện để có thể lọc ra được đơn hàng theo đoạn text được truyền vào
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
      listDH: listDH, // truyền listDh sau khi đã được lọc ra view để hiển thị lên view
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
    const { trangThaiDonHang } = req.query; // Truyền trạng thái vào để tiến hành lọc đơn hàng theo trạng thái
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;
    let filter = {};
    if (trangThaiDonHang) {
      filter.trangThaiDonHang = { $regex: trangThaiDonHang, $options: "i" };
    }

    const totalItems = await donHangModel.countDocuments(filter);
    const listDH = await donHangModel
      .find(filter) // truyền điều kiện là trạng thái được truyền vào để lấy ra đơn hàng theo trạng thái đó
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
      listDH: listDH, // truyền listDH theo trạng thái ra bên ngoài để hiển thị lên UI
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

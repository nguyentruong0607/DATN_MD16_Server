const donHangModel = require("../../model/donHang");
const khuyenMaiModel = require("../../model/khuyenMai");
const { DienThoai } = require("../../model/sanPham");
const thongBaoModel = require("../../model/thongBao");

// thêm don hang
exports.createDonHang = async (req, res, next) => {
  let soLuong = req.body.soLuong;
  let tongTien = req.body.tongTien;
  let idKH = req.body.idKH;
  let sp = req.body.sp;
  let idDiaChi = req.body.idDiaChi;
  let trangThaiThanhToan = req.body.trangThaiThanhToan;
  let ghiChu = req.body.ghiChu;
  let ngayDatHang = req.body.ngayDatHang;
  let ngayNhanHang = req.body.ngayNhanHang;
  let diaChiGiaoHang = req.body.diaChiGiaoHang;
  let trangThaiDonHang = req.body.trangThaiDonHang;
  let phuongThucThanhToan = req.body.phuongThucThanhToan;
  let idKM = req.body.idKM;

  if (idKM) {
    const khuyenMai = await khuyenMaiModel.findOne({ _id: idKM });
    const updatedKhuyenMai = await khuyenMaiModel.findOneAndUpdate(
      { _id: khuyenMai._id },
      {
        soLuong: khuyenMai.soLuong - 1,
        soLanApDung: khuyenMai.soLanApDung + 1,
      },
      { new: true }
    );
  }

  try {
    for (const item of sp) {
      // Tìm sản phẩm theo idSP
      const dienThoai = await DienThoai.findById(item.idSP);

      if (dienThoai) {
        // Tìm đúng màu trong mauSchema
        const selectedMau = dienThoai.mauSchema.find(
          (mau) => mau._id.toString() === item.idMau.toString()
        );

        if (selectedMau) {
          // Cập nhật số lượng của màu
          selectedMau.soLuong -= item.soLuong;

          // Lưu lại sản phẩm với số lượng màu đã cập nhật
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

    let addFields = {
      soLuong: soLuong,
      tongTien: tongTien,
      idKH: idKH,
      sp: sp,
      idDiaChi: idDiaChi,
      trangThaiThanhToan: trangThaiThanhToan,
      ghiChu: ghiChu,
      ngayDatHang: ngayDatHang,
      ngayNhanHang: ngayNhanHang,
      diaChiGiaoHang: diaChiGiaoHang,
      trangThaiDonHang: trangThaiDonHang,
      phuongThucThanhToan: phuongThucThanhToan,
      idKM: idKM,
    };

    const formattedTongTien = tongTien.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    let addItems = await donHangModel.create(addFields);

    await thongBaoModel.create({
      idDonHang: addItems._id,
      idAccount: idKH,
      tieuDe: "Đặt hàng thành công!",
      noiDung: `Đơn hàng của bạn với mã đơn hàng ${addItems._id} đã được đặt thành công với tổng tiền là ${formattedTongTien}.`,
    });

    res
      .status(201)
      .json({ message: "Thêm đơn hàng thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// lấy tất cả các dữ liệu
exports.listDonHang = async (req, res, next) => {
  try {
    const donHang = await donHangModel
      .find()
      .populate("idKH")
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      })
      .populate("idDiaChi");

    if (donHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu đơn hang thành công",
        data: donHang,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu don hàng",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

exports.getDonHangByIDKH = async (req, res, next) => {
  try {
    // Lấy idKH từ params
    const idKH = req.params.idKH;

    // Tìm đơn hàng với idKH tương ứng và populate các trường liên quan
    const donHang = await donHangModel
      .find({ idKH: idKH })
      .populate("idKH")
      .populate({
        path: "sp.idSP",
        model: "DienThoai",
      })
      .populate("idDiaChi");

    if (donHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu đơn hàng theo ID khách hàng thành công",
        data: donHang,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu đơn hàng cho ID khách hàng này",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteDonHang = async (req, res, next) => {
  try {
    await donHangModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa don hang thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

// cập nhật trạng thái đơn hàng
exports.updateDonHang = async (req, res, next) => {
  try {
    let trangThaiDonHang = req.body.trangThaiDonHang;
    let trangThaiThanhToan = req.body.trangThaiThanhToan;

    // Cập nhật trạng thái đơn hàng dựa trên ID của đơn hàng
    let updatedDonHang = await donHangModel.findByIdAndUpdate(
      req.params.id,
      {
        trangThaiDonHang: trangThaiDonHang,
        trangThaiThanhToan: trangThaiThanhToan,
      },
      { new: true }
    );

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

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!updatedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json({
      status: 200,
      message: "Cập nhật trạng thái đơn hàng thành công",
      updatedDonHang: updatedDonHang,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

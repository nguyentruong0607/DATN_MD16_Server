const donHangModel = require("../../model/donHang");
const khuyenMaiModel = require("../../model/khuyenMai");

// thêm don hang
exports.createDonHang = async (req, res, next) => {
  let soLuong = req.body.soLuong;
  let tongTien = req.body.tongTien;
  let idKH = req.body.idKH;
  let idSP = req.body.idSP;
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
    let addFields = {
      soLuong: soLuong,
      tongTien: tongTien,
      idKH: idKH,
      idSP: idSP,
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

    let addItems = await donHangModel.create(addFields);

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
      .populate("idSP")
      .populate("idDiaChi");

    if (donHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu don hang thành công",
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
      .find({ idKH })
      .populate("idKH")
      .populate("idSP");

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

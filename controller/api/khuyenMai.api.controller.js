const { khuyenMaiModel } = require("../../model/khuyenMai");

// thêm khuyen mai
exports.createKhuyenMai = async (req, res, next) => {
  try {
    const { giamGia, thoiGian, trangThai } = req.body;

    const newKM = new KhuyenMai({ giamGia, thoiGian, trangThai });
    const savedKM = await newKM.save();
    return res
      .status(201)
      .json({ success: true, message: "Đã thêm khuyen mai!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// lấy tất cả các dữ liệu
exports.listKhuyenMai = async (req, res, next) => {
  try {
    const khuyenMai = await khuyenMaiModel.find();
    if (khuyenMai.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu khuyến mãi thành công",
        data: khuyenMai,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu khuyến mãi",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteKhuyenMai = async (req, res, next) => {
  try {
    await khuyenMaiModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa khuyến mãi thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

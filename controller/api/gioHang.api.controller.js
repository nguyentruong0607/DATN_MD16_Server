const { gioHangModel } = require("../../model/gioHang");

// thêm gio hang
exports.createGioHang = async (req, res, next) => {
  try {
    const { soLuong, tongTien, idKH } = req.body;

    const newGH = new GioHang({ soLuong, tongTien, idKH });
    const savedGH = await newGH.save();
    return res
      .status(201)
      .json({ success: true, message: "Đã thêm gio hang!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// lấy tất cả các dữ liệu
exports.listGioHang = async (req, res, next) => {
  try {
    const gioHang = await gioHangModel.find();
    if (gioHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu gio hang thành công",
        data: gioHang,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu giỏ hàng",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteGioHang = async (req, res, next) => {
  try {
    await gioHangModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa gio hang thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

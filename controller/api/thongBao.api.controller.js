const { thongBaoModel } = require("../../model/thongBao");

// Thêm thong bao
exports.createThongBao = async (req, res, next) => {
  try {
    const { noiDung } = req.body;

    const newTB = new ThongBao({ noiDung });
    const savedTB = await newTB.save();
    return res
      .status(201)
      .json({ success: true, message: "Đã thêm thông báo thành công!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// lấy tất cả các dữ liệu
exports.listThongBao = async (req, res, next) => {
  try {
    const thongBao = await thongBaoModel.find();
    if (thongBao.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu thong  bao thành công",
        data: thongBao,
      });
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu thong bao", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteThongBao = async (req, res, next) => {
  try {
    await thongBaoModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa thông báo thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

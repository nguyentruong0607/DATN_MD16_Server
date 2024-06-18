const { danhGiaModel } = require("../../model/danhGia");

// thêm danh gia
exports.createDanhGia = async (req, res, next) => {
  try {
    const { noiDung, thoiGian, diemDanhGia, idKH, idSP } = req.body;

    const newDG = new DanhGia({ noiDung, thoiGian, diemDanhGia, idKH, idSP });
    const savedDG = await newDG.save();
    return res
      .status(201)
      .json({ success: true, message: "Đã thêm danh gia!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// lấy tất cả các dữ liệu
exports.listDanhGia = async (req, res, next) => {
  try {
    const danhGia = await danhGiaModel.find();
    if (danhGia.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu danh gia thành công",
        data: danhGia,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu danh gia",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteDanhGia = async (req, res, next) => {
  try {
    await danhGiaModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa danh gia thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

const  khuyenMaiModel  = require("../../model/khuyenMai");

// thêm khuyen mai
exports.createKhuyenMai = async (req, res, next) => {
  let giamGia = req.body.giamGia;
  let thoiGian = req.body.thoiGian;
  let trangThai = req.body.trangThai;

  try {
    let addFields = {
      giamGia: giamGia,
      thoiGian: thoiGian,
      trangThai: trangThai,
    };

    let addItems = await khuyenMaiModel.create(addFields);

    res
      .status(201)
      .json({ message: "Thêm khuyến mại thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
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

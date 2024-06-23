const  danhGiaModel  = require("../../model/danhGia");

// thêm danh gia
exports.createDanhGia = async (req, res, next) => {
  let noiDung = req.body.noiDung;
  let thoiGian = req.body.thoiGian;
  let diemDanhGia = req.body.diemDanhGia;
  let idKH = req.body.idKH;
  let idSP = req.body.idSP;

  try {
    let addFields = {
      noiDung: noiDung,
      thoiGian: thoiGian,
      diemDanhGia: diemDanhGia,
      idKH: idKH,
      idSP: idSP,
    };

    let addItems = await danhGiaModel.create(addFields);

    res
      .status(201)
      .json({ message: "Thêm đánh giá thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// lấy tất cả các dữ liệu
exports.listDanhGia = async (req, res, next) => {
  try {
    const danhGia = await danhGiaModel.find().populate("idKH").populate("idSP");
    if (danhGia.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu đánh giá thành công",
        data: danhGia,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu đánh giá",
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

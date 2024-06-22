const { thongBaoModel } = require("../../model/thongBao");

// Thêm thong bao
exports.createThongBao = async (req, res, next) => {
  let noiDung = req.body.noiDung;
  let thoiGian = req.body.thoiGian;
  let idKH = req.body.idKH;

  try {
    let addFields = {
      noiDung: noiDung,
      thoiGian: thoiGian,
      idKH: idKH,
    };

    let addItems = await thongBaoModel.create(addFields);

    res
      .status(201)
      .json({ message: "Thêm thông báo thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// lấy tất cả các dữ liệu
exports.listThongBao = async (req, res, next) => {
  try {
    const thongBao = await thongBaoModel.find().populate("idKH");
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

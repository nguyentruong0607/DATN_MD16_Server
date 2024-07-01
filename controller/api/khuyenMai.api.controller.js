const khuyenMaiModel = require("../../model/khuyenMai");

// thêm khuyen mai
exports.createKhuyenMai = async (req, res, next) => {
  let ngayBatDau = req.body.ngayBatDau;
  let ngayKetThuc = req.body.ngayKetThuc;
  let ten = req.body.ten;
  let giaKhoiDiem = req.body.giaKhoiDiem;
  let soLuong = req.body.soLuong;
  let soLanApDung = 0;
  let trangThai = true;

  try {
    let addFields = {
      ten: ten,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      giaKhoiDiem: giaKhoiDiem,
      soLuong: soLuong,
      soLanApDung: soLanApDung,
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

// Update
exports.updateKM = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const {
      ngayBatDau,
      ngayKetThuc,
      ten,
      giaKhoiDiem,
      soLuong,
      soLanApDung,
      trangThai,
    } = req.body;

    const updatedFields = {
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      ten: ten,
      giaKhoiDiem: giaKhoiDiem,
      soLuong: soLuong,
      soLanApDung: soLanApDung,
      trangThai: trangThai,
    };

    const updatedItem = await khuyenMaiModel.findOneAndUpdate(
      { _id: _id },
      updatedFields,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Update KM thành công!", item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

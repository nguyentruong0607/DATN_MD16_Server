const thongBaoModel = require("../../model/thongBao");

// Thêm thông báo
exports.createThongBao = async (req, res, next) => {

  try {
    let thongBao = new thongBaoModel();
      thongBao.tieuDe=req.body.tieuDe,
      thongBao.noiDung= req.body.noiDung,
      thongBao.thoiGian= req.body.thoiGian,
      thongBao.idAccount= req.body.idAccount
    

    let new_t  = await thongBao.save();

    res
      .status(201)
      .json({ message: "Thêm thông báo thành công", new_t:new_t });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy tất cả thông báo theo idAccount
exports.listThongBao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const thongBao = await thongBaoModel.find({ idAccount: id });
    if (thongBao.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu thông báo thành công",
        data: thongBao,
      });
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu thông báo", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Xóa thông báo theo ID
exports.deleteThongBao = async (req, res, next) => {
  try {
    let id= req.params.id;
    await thongBaoModel.findByIdAndDelete(id);
    res.json({ status: 200, msg: "Xóa thông báo thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};



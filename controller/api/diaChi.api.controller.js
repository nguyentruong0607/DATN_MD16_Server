const diaChiModel = require("../../model/diaChi");

// thêm
exports.createDiaChi = async (req, res, next) => {
  let msg = "";
  try {
    // tạo mdel để gán dữ liệu
    let objU = new diaChiModel();
    objU.ten = req.body.ten;
    objU.sdt = req.body.sdt;
    objU.diaChi = req.body.diaChi;
    objU.idAccount = req.body.idAccount;
    // ghi vào csdl
    let new_u = await objU.save();

    msg = "Thêm mới thành công";
    res.json({ msg: msg, new_u: new_u });
  } catch (error) {
    msg = error.message;
    res.json({ msg: msg });
  }
};

// lấy tất cả các dữ liệu
exports.listDiaChi = async (req, res, next) => {
  try {
    const DiaChi = await diaChiModel.find();
    if (DiaChi.length > 0) {
      res.json({ status: 200, msg: "Lấy dữ liệu  thành công", data: DiaChi });
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu ", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// LẤY THEO ID
exports.getDiaChiById = async (req, res, next) => {
  try {
    const _id = req.params._id;

    const DiaChi = await diaChiModel
      .findById({ _id: _id })
      .populate("idAccount");
    if (DiaChi) {
      res.json({ status: 200, msg: "Lấy dữ liệu  thành công", data: DiaChi });
    } else {
      res.json({ status: 204, msg: "Không tìm thấy ", data: null });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: null });
  }
};

// LẤY THEO ID Account
exports.getDiaChiByIdAccount = async (req, res, next) => {
  try {
    const idAccount = req.params.idAccount;

    console.log("idAccount:", idAccount);

    const DiaChi = await diaChiModel
      .find({ idAccount: idAccount })
      .populate("idAccount");
    if (DiaChi) {
      res.json({ status: 200, msg: "Lấy dữ liệu thành công", data: DiaChi });
    } else {
      res.json({ status: 204, msg: "Không tìm thấy ", data: null });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: null });
  }
};

// Update by ID
exports.updateDiaChi = async (req, res, next) => {
  try {
    let id = req.params.id;

    let objU = {};
    objU.ten = req.body.ten;
    objU.sdt = req.body.sdt;
    objU.diaChi = req.body.diaChi;
    objU.idAccount = req.body.idAccount;
    // ghi vào csdl
    let kq = await diaChiModel.findByIdAndUpdate(id, objU);

    msg = "Sửa thành công";
    res.json({ msg: msg, kq: kq });
  } catch (error) {
    msg = error.message;
    res.json({ msg: msg });
  }
};

// Delete by ID
exports.deleteDiaChi = async (req, res, next) => {
  try {
    await diaChiModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa  thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

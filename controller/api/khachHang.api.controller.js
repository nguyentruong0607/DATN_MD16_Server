const { khachHangModel } = require("../../model/khachHang");

// Login Khach hang
exports.loginKhachHang = async (req, res, next) => {
  const { tenDN, matKhau } = req.body;
  console.log("[khachHang.api.controller] [loginKhachHang] body: ", req.body);
  try {
    const khachHang = await khachHangModel.findOne({ tenDN });
    console.log(
      "[khachHang.api.controller] [loginKhachHang] khach hang login: ",
      khachHang
    );

    if (!khachHang) {
      return res.status(401).json({ message: "Tên đăng nhập không đúng" });
    }

    // So sánh mật khẩu nhập vào với mật khẩu trong cơ sở dữ liệu
    if (matKhau !== khachHang.matKhau) {
      return res
        .status(401)
        .json({ message: "Mật khẩu đăng nhập không đúng !" });
    }

    res.status(200).json({ message: "Đăng nhập thành công", data: khachHang });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu" });
  }
};

exports.registerKhachHang = async (req, res, next) => {
  console.log(
    "[khachHang.api.controller] [registerKhachHang] khach hang register: ",
    req.body
  );
  let tenDN = req.body.tenDN;
  let matKhau = req.body.matKhau;
  let hoVaTen = req.body.hoVaTen;
  let sdt = req.body.sdt;

  try {
    let addFields = {
      tenDN: tenDN,
      matKhau: matKhau,
      sdt: sdt,
      hoVaTen: hoVaTen,
    };

    console.log(
      "[khachHang.api.controller] [registerKhachHang] addFields: ",
      addFields
    );

    let addItems = await khachHangModel.create(addFields);
    console.log(
      "[khachHang.api.controller] [registerKhachHang] addItems: ",
      addItems
    );

    res
      .status(201)
      .json({ message: "Đăng ký thông tin thành công", newItem: addItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// lấy tất cả các dữ liệu
exports.listKhachHang = async (req, res, next) => {
  try {
    const khachHang = await khachHangModel.find();
    if (khachHang.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu khach hang thành công",
        data: khachHang,
      });
    } else {
      res.json({
        status: 204,
        msg: "Không có dữ liệu khach hàng",
        data: [],
      });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// Delete by ID
exports.deleteKhachHang = async (req, res, next) => {
  try {
    await khachHangModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa khach hang thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

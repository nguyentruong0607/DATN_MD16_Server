const {hangsxModel} = require('../../model/hangSX');

// thêm hang sx
exports.createHangSX = async (req, res, next) => {
    let msg = '';
    try {
        // tạo mdel để gán dữ liệu
        let objU = new hangsxModel();
        objU.tenHang = req.body.tenHang;
      
 
 
        // ghi vào csdl
        let new_u = await objU.save();
       
        msg = "Thêm mới thành công";
        res.json ({msg: msg, new_u: new_u})
    } catch (error) {
        msg = error.message;
        res.json ({msg: msg })
 
 
    }
 
};

// lấy tất cả các dữ liệu
exports.listHangsx = async (req, res, next) => {
  try {
    const hangsx = await hangsxModel.find();
    if (hangsx.length > 0) {
      res.json({ status: 200, msg: "Lấy dữ liệu hãng sản xuất thành công", data: hangsx });
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu hãng sản xuất", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// LẤY THEO ID
exports.getHangsxById = async (req, res, next) => {
  try {
    const hangsx= await hangsxModel.findById(req.params.id);
    if (hangsx) {
      res.json({ status: 200, msg: "Lấy dữ liệu hãng sản xuất thành công", data: hangsx });
    } else {
      res.json({ status: 204, msg: "Không tìm thấy hãng sản xuất", data: null });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: null });
  }
};

// Update by ID
exports.updateHangsx = async (req, res, next) => {
    try {
        let id = req.params.id ;
        // nếu có thay đổi dữ liệu thì mới validate
        // vd: Validate tenHang khi có nhập
        if(req.body.tenHang || req.body.tenHang.length >0){
            if(req.body.tenHang.length>30 || req.body.tenHang.length<=3)
              throw new Error("Ten hang không hợp lệ");
        }
        let objU = {};
        objU.tenHang = req.body.tenHang;
        // ghi vào csdl
        let kq = await hangsxModel.findByIdAndUpdate(id,objU);
       
        msg = "Sửa thành công";
        res.json ({msg: msg, kq: kq})
    } catch (error) {
        msg = error.message;
        res.json ({msg: msg })
 
 
    }
 
};

// Delete by ID
exports.deleteHangSX = async (req, res, next) => {
  try {
    await hangsxModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa hãng sản xuất thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};
const {dienThoaiModel} = require('../../model/sanPham');

// thêm hang sx
exports.createsanPham = async (req, res, next) => {
    let msg = '';
    try {
        // tạo mdel để gán dữ liệu
        let obj = new dienThoaiModel();
        obj.tenDienThoai = req.body.tenDienThoai;
        obj.camera = req.body.camera;
        obj.kichThuoc = req.body.kichThuoc;
        obj.cPU=req.body.cPU;
        obj.pin=req.body.pin;
        obj.heDieuHanh=req.body.heDieuHanh;
        obj.namSanXuat=req.body.namSanXuat;
        obj.congNgheManHinh=req.body.congNgheManHinh;
        obj.moTaThem=req.body.moTaThem;
        obj.hinhAnh=req.body.hinhAnh;
        obj.doPhanGiai=req.body.doPhanGiai;
        obj.sim=req.body.sim;
        obj.ram=req.body.ram;
        obj.cameraTruoc=req.body.cameraTruoc;
        obj.idHangSX=req.body.idHangSX; 

        // ghi vào csdl
        let new_u = await obj.save();
       
        msg = "Thêm mới thành công";
        res.json ({msg: msg, new_u: new_u})
    } catch (error) {
        msg = error.message;
        res.json ({msg: msg })
 
 
    }
 
};

// lấy tất cả các dữ liệu
exports.listsanPham = async (req, res, next) => {
  try {
    const sanPham = await dienThoaiModel.find();
    if (sanPham.length > 0) {
      res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm thành công", data: sanPham });
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu sản phẩm", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};

// LẤY THEO ID
exports.getsanPhamById = async (req, res, next) => {
  try {
    const sanPham= await dienThoaiModel.findById(req.params.id);
    if (sanPham) {
      res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm thành công", data: sanPham });
    } else {
      res.json({ status: 204, msg: "Không tìm thấy sản phẩm", data: null });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: null });
  }
};

// Update by ID
exports.updatesanPham = async (req, res, next) => {
    try {
        let id = req.params.id ;
        let obj = {};
        obj.tenDienThoai = req.body.tenDienThoai;
        obj.camera = req.body.camera;
        obj.kichThuoc = req.body.kichThuoc;
        obj.cPU=req.body.cPU;
        obj.pin=req.body.pin;
        obj.heDieuHanh=req.body.heDieuHanh;
        obj.namSanXuat=req.body.namSanXuat;
        obj.congNgheManHinh=req.body.congNgheManHinh;
        obj.moTaThem=req.body.moTaThem;
        obj.hinhAnh=req.body.hinhAnh;
        obj.doPhanGiai=req.body.doPhanGiai;
        obj.sim=req.body.sim;
        obj.ram=req.body.ram;
        obj.cameraTruoc=req.body.cameraTruoc;
        // ghi vào csdl
        let kq = await dienThoaiModel.findByIdAndUpdate(id,obj);
       
        msg = "Sửa thành công";
        res.json ({msg: msg, kq: kq})
    } catch (error) {
        msg = error.message;
        res.json ({msg: msg })
 
 
    }
 
};

// Delete by ID
exports.deletesanPham = async (req, res, next) => {
  try {
    await dienThoaiModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa sản phẩm thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};
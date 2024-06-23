const DienThoai = require('../../model/sanPham').DienThoai;
const DienThoaiCT = require('../../model/sanPham').DienThoaiCT;
const HangSX = require('../../model/hangSX');
// thêm hang sx
exports.createsanPham = async (req, res, next) => {
    let msg = '';
    try {
        // tạo mdel để gán dữ liệu
        let obj = new DienThoai({
            tenDienThoai: req.body.tenDienThoai,
            camera: req.body.camera,
            kichThuoc: req.body.kichThuoc,
            cPU: req.body.cPU,
            pin: req.body.pin,
            heDieuHanh: req.body.heDieuHanh,
            namSanXuat: req.body.namSanXuat,
            congNgheManHinh: req.body.congNgheManHinh,
            moTaThem: req.body.moTaThem,
            hinhAnh: req.body.hinhAnh,
            doPhanGiai: req.body.doPhanGiai,
            sim: req.body.sim,
            ram: req.body.ram,
            cameraTruoc: req.body.cameraTruoc,
            idHangSX: req.body.idHangSX
        });

        let new_dienThoai = await obj.save();

        let dienThoaiCTObj = new DienThoaiCT({
            idDienThoai: new_dienThoai._id,
            Mau: { mau: req.body.Mau },
            DungLuong: { dungLuong: req.body.DungLuong },
            soLuong: req.body.soLuong,
            giaTien: req.body.giaTien
        });

        let new_dienThoaiCT = await dienThoaiCTObj.save();

        msg = "Thêm mới thành công";
        res.json({ msg: msg, new_dienThoai: new_dienThoai, new_dienThoaiCT: new_dienThoaiCT });
    } catch (error) {
        msg = error.message;
        res.json({ msg: msg });
    }

};


// lấy tất cả các dữ liệu
exports.listsanPham = async (req, res, next) => {
  try {
    const sanPham = await DienThoai.find().populate('idHangSX');
    const sanPhamCT = await DienThoaiCT.find().populate('idDienThoai');

    if (sanPham.length > 0 || sanPhamCT.length > 0) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu sản phẩm thành công",
        data: { sanPham, sanPhamCT }
      });
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
    const sanPham = await DienThoai.findById(req.params.id).populate('idHangSX');
    const sanPhamCT = await DienThoaiCT.findOne({ idDienThoai: req.params.id }).populate('idDienThoai');

    if (sanPham) {
      res.json({
        status: 200,
        msg: "Lấy dữ liệu sản phẩm thành công",
        data: { sanPham, sanPhamCT }
      });
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
      let id = req.params.id;
      let updatedData = {
          tenDienThoai: req.body.tenDienThoai,
          camera: req.body.camera,
          kichThuoc: req.body.kichThuoc,
          cPU: req.body.cPU,
          pin: req.body.pin,
          heDieuHanh: req.body.heDieuHanh,
          namSanXuat: req.body.namSanXuat,
          congNgheManHinh: req.body.congNgheManHinh,
          moTaThem: req.body.moTaThem,
          hinhAnh: req.body.hinhAnh,
          doPhanGiai: req.body.doPhanGiai,
          sim: req.body.sim,
          ram: req.body.ram,
          cameraTruoc: req.body.cameraTruoc,
          idHangSX: req.body.idHangSX
      };

      let updatedProduct = await DienThoai.findByIdAndUpdate(id, updatedData, { new: true });

      let updatedCTData = {
          Mau: { mau: req.body.Mau },
          DungLuong: { dungLuong: req.body.DungLuong },
          soLuong: req.body.soLuong,
          giaTien: req.body.giaTien
      };

      let updatedProductCT = await DienThoaiCT.findOneAndUpdate({ idDienThoai: id }, updatedCTData, { new: true });

      res.json({ msg: "Sửa thành công", updatedProduct: updatedProduct, updatedProductCT: updatedProductCT });
  } catch (error) {
      res.json({ msg: error.message });
  } 
  
};


// Delete by ID
exports.deletesanPham = async (req, res, next) => {
  try {
    await DienThoai.deleteOne({ _id: req.params.id });
    await DienThoaiCT.deleteOne({ idDienThoai: req.params.id });

    res.json({ status: 200, msg: "Xóa sản phẩm thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

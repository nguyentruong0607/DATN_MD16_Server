const { DienThoai } = require('../../model/sanPham');
const HangSX = require('../../model/hangSX');
// thêm hang sx
exports.createsanPham = async (req, res, next) => {
  let msg = '';
  try {
    const { idHangSX, tenDienThoai, camera, cameraTruoc, kichThuoc,
      cPU, ram, sim, heDieuHanh, pin, namSanXuat, congNgheManHinh, moTaThem,
      hinhAnh, doPhanGiai, mau, soLuong, giaTien } = req.body;
    // tạo model để gán dữ liệu
    let newSanPham = new DienThoai({
      tenDienThoai, camera, cameraTruoc, kichThuoc, cPU, ram,
      sim, pin, heDieuHanh, namSanXuat,
      congNgheManHinh, moTaThem, hinhAnh, doPhanGiai,
      idHangSX
    });
    newSanPham.mauSchema = { mau, soLuong, giaTien }
    const new_dienThoai = await newSanPham.save();
    msg = "Thêm mới thành công";
    res.json({ msg: msg, new_dienThoai: new_dienThoai });
  } catch (error) {
    msg = error.message;
    res.json({ msg: msg });
  }

};


// lấy tất cả các dữ liệu
exports.listsanPham = async (req, res, next) => {
  try {
    const sanPham = await DienThoai.find();
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LẤY THEO ID
exports.getsanPhamById = async (req, res, next) => {
  try {
    const sanPham = await DienThoai.findById(req.params.id);
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
//tìm kiếm sản phâm thoe tên gần giống
exports.searchSanPham= async(req,res,next)=>{
  try {
    //lấy tên sản phẩm tử request body
    const {tenDienThoai}=req.body;
    //tìm kiếm các sản phẩm có ten gần giống với tên được gửi lên
    const sanPham=await DienThoai.find({tenDienThoai:{$regex:tenDienThoai, $options:'i'}});
    res.json(sanPham)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//sửa sản phẩm
exports.updatesanPham = async (req, res, next) => {
  try {
    let id = req.params.id;
    const { idHangSX, tenDienThoai, camera, cameraTruoc, kichThuoc, cPU, ram, sim, heDieuHanh, pin, namSanXuat, congNgheManHinh, moTaThem, hinhAnh, doPhanGiai, mau, soLuong, giaTien } = req.body;

    // ktra xem sản phẩm có tồn tại hay không
    const existingProduct = await DienThoai.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // cập nhật thông tin sản phẩm
    existingProduct.idHangSX = idHangSX || existingProduct.idHangSX;
    existingProduct.tenDienThoai = tenDienThoai || existingProduct.tenDienThoai;
    existingProduct.camera = camera || existingProduct.camera;
    existingProduct.cameraTruoc = cameraTruoc || existingProduct.cameraTruoc;
    existingProduct.kichThuoc = kichThuoc || existingProduct.kichThuoc;
    existingProduct.cPU = cPU || existingProduct.cPU;
    existingProduct.ram = ram || existingProduct.ram;
    existingProduct.sim = sim || existingProduct.sim;
    existingProduct.heDieuHanh = heDieuHanh || existingProduct.heDieuHanh;
    existingProduct.pin = pin || existingProduct.pin;
    existingProduct.namSanXuat = namSanXuat || existingProduct.namSanXuat;
    existingProduct.congNgheManHinh = congNgheManHinh || existingProduct.congNgheManHinh;
    existingProduct.moTaThem = moTaThem || existingProduct.moTaThem;
    existingProduct.hinhAnh = hinhAnh || existingProduct.hinhAnh;
    existingProduct.doPhanGiai = doPhanGiai || existingProduct.doPhanGiai;
    existingProduct.mau = mau || existingProduct.mau;
    existingProduct.soLuong = soLuong || existingProduct.soLuong;
    existingProduct.giaTien = giaTien || existingProduct.giaTien;

    const updatedProduct = await existingProduct.save();
    res.json({ msg: "Sửa thành công", updatedProduct: updatedProduct });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

};


// Delete by ID
exports.deletesanPham = async (req, res, next) => {
  try {
    await DienThoai.deleteOne({ _id: req.params.id });


    res.json({ status: 200, msg: "Xóa sản phẩm thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};

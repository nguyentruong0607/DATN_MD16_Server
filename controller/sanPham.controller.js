const dienThoai = require("../model/sanPham");
const hangsxModel = require("../model/hangSX");
const { uploadImage } = require('../middleware/upload.image.firebase');
const nameFolder='SanPham'
// Hiển thị danh sách sản phẩm
// exports.getAllSP = async (req, res, next) => {
//   const trangThai = req.query.trangThai || '';
//   try {
//     const list = await dienThoai.DienThoai.find();
//     res.render("sanPham/list", {
//       listSP: list,
//       msg: "Lấy dữ liệu thành công !",
//       title: "Quản lý sản phẩm",
//     });
//   } catch (error) {
//     console.error("Error in getAllSP:", error);
//     res.status(500).json({ message: "Lỗi khi lấy dữ liệu sản phẩm" });
//   }
// };
// Hiển thị danh sách sản phẩm
exports.getAllSP = async (req, res, next) => {
  const trangThai = req.query.trangThai || '';
  try {
    let filter = {};
    if (trangThai !== '') {
      filter.trangThai = trangThai === 'true';
    }
    const list = await dienThoai.DienThoai.find(filter);
    res.render("sanPham/list", {
      listSP: list,
      trangThai: trangThai,
      msg: "Lấy dữ liệu thành công!",
      title: "Quản lý sản phẩm",
    });
  } catch (error) {
    console.error("Error in getAllSP:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu sản phẩm" });
  }
};



// chi tiết sản phẩm
exports.chiTiet = async (req, res, next) => {
  try {
    const user = req.session.account;
    const dienthoai = await dienThoai.DienThoai.findById(req.params.id);
    res.render("sanPham/chiTiet", {
      title: "Chi tiết sản phẩm",
      dienthoai: dienthoai,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//thêm sản phẩm
exports.add = async (req, res, next) => {
  if (req.method === "POST") {
    const {
      idHangSX,
      tenDienThoai,
      camera,
      cameraTruoc,
      kichThuoc,
      cPU,
      ram,
      sim,
      heDieuHanh,
      pin,
      namSanXuat,
      congNgheManHinh,
      moTaThem,
      doPhanGiai,
      mau,
      soLuong,
      giaTien,
      giaGoc,
      giamGia,
      trangThai,
    } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      console.error("No files uploaded");
      return res.status(400).json({ message: 'Chưa có file upload' });
    }

    let imageUrlAnhSanPham;
    try {
      for (const file of files) {
        if (file.fieldname === 'hinhAnh') {
          console.log(`Uploading file: ${file.originalname}`);
          imageUrlAnhSanPham = await uploadImage(file, nameFolder);
          console.log(`Uploaded file URL: ${imageUrlAnhSanPham}`);
        }
      }

      let existingProduct = await dienThoai.DienThoai.findOne({
        tenDienThoai,
        camera,
        cameraTruoc,
        kichThuoc,
        cPU,
        ram,
        sim,
        heDieuHanh,
        pin,
        namSanXuat,
        congNgheManHinh,
        moTaThem,
        doPhanGiai,
        idHangSX,
        giaGoc,
        giamGia,
        trangThai: true,
      });

      if (existingProduct) {
        existingProduct.mauSchema.push({ mau, soLuong, giaTien });
        await existingProduct.save();
      } else {
        const newSanPham = new dienThoai.DienThoai({
          tenDienThoai,
          camera,
          cameraTruoc,
          kichThuoc,
          cPU,
          ram,
          sim,
          pin,
          heDieuHanh,
          namSanXuat,
          congNgheManHinh,
          moTaThem,
          hinhAnh: imageUrlAnhSanPham,
          doPhanGiai,
          idHangSX,
          giaGoc,
          giamGia,
          trangThai: true,
          mauSchema: [{ mau, soLuong, giaTien }],
        });
        await newSanPham.save();
      }
      res.redirect("/sanPham");
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Thêm sản phẩm thất bại" });
    }
  } else {
    try {
      const user = req.session.account;
      const listHangSx = await hangsxModel.find();
      res.render("sanPham/add", {
        title: "Thêm sản phẩm mới",
        listHangSx: listHangSx,
        user: user,
      });
    } catch (error) {
      console.error("Error rendering add product page:", error);
      res.status(500).json({ message: error.message });
    }
  }
};



//tìm kiếm
exports.search = async (req, res, next) => {
  const queryValue = req.query.query;
  const user = req.session.account;
  try {
    if (queryValue.lenght === 0) {
      const listSanPham = await dienThoai.DienThoai.find();
      res.render("sanPham/list", {
        title: "Quản lý sản phẩm",
        listSP: listSanPham,
        user: user,
      });
    } else {
      const listSanPham = await dienThoai.DienThoai.find({
        tenDienThoai: { $regex: queryValue, $options: "i" },
      });
      res.render("sanPham/list", {
        title: "Quản lý sản phẩm",
        listSP: listSanPham,
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editSP = async (req, res) => {
  try {
    const user = req.session.Account;
    const product = await dienThoai.DienThoai.findById(req.params.id);
    const listHangSx = await hangsxModel.find();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.render("sanPham/edit", {
      title: "Chỉnh sửa sản phẩm",
      product: product,
      listHangSx: listHangSx,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  if (req.method == "POST") {
    try {
      await dienThoai.DienThoai.findByIdAndDelete(productId);
      res.redirect("/sanPham");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      res.status(500).json({ message: "Xóa sản phẩm thất bại" });
    }
  }
};

//thêm màu
exports.addColor = async (req, res) => {
  try {
    const { mau, soLuong, giaTien } = req.body;
    const newMau = { mau, soLuong, giaTien };
    const dienthoai = await dienThoai.DienThoai.findById(req.params.id);

    if (!dienthoai) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Check if the color already exists
    const colorExists = dienthoai.mauSchema.some(variant => variant.mau === mau);
    if (colorExists) {
      return res.status(400).json({ message: "Màu này đã tồn tại" });
    }

    dienthoai.mauSchema.push(newMau);
    await dienthoai.save();
    res.json({ message: "Biến thể đã được thêm thành công" });
  } catch (error) {
    console.error("Error adding color:", error);
    res.status(500).json({ message: error.message });
  }
};




exports.updateColor = async (req, res) => {
  try {
    const productId = req.params.productId; // ID của sản phẩm
    const variantId = req.params.variantId; // ID của màu
    const newData = req.body; // Dữ liệu mới của màu từ request body

    // Tìm sản phẩm theo ID
    const product = await DienThoai.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm và cập nhật màu trong mảng màu của sản phẩm
    const mau = product.mauSchema.id(variantId);
    if (!mau) {
      return res.status(404).json({ message: "Màu không tồn tại" });
    }

    mau.set(newData); // Cập nhật dữ liệu mới của màu
    await product.save();

    res.json({ message: "Thông tin của màu đã được cập nhật" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

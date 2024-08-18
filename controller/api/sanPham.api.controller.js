const { DienThoai } = require("../../model/sanPham");
const sanPhamYTModel= require("../../model/sanPhamYT");
const donHangModel=require("../../model/donHang");
const { uploadImage } = require("../../middleware/upload.image.firebase");
const nameFolder = "SanPham";
// thêm sản phẩm
exports.createsanPham = async (req, res, next) => {
  let msg = "";
  try {
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
      hinhAnh,
      doPhanGiai,
      mau,
      soLuong,
      giaTien,
      giamGia,
      trangThai,
    } = req.body;

    // Tìm sản phẩm theo tên
    let existingProduct = await DienThoai.findOne({ tenDienThoai });

    if (existingProduct) {
      // Kiểm tra xem màu đã tồn tại hay chưa
      const existingColor = existingProduct.mauSchema.find(
        (item) => item.mau === mau
      );
      if (existingColor) {
        return res
          .status(400)
          .json({ msg: "Màu này đã tồn tại cho sản phẩm này" });
      }

      // Thêm màu mới vào sản phẩm
      existingProduct.mauSchema.push({ mau, soLuong, giaTien });
      await existingProduct.save();
      msg = "Thêm màu mới thành công";
      return res.json({ msg: msg, updatedProduct: existingProduct });
    } else {
      // Tạo sản phẩm mới nếu chưa tồn tại
      let newSanPham = new DienThoai({
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
        hinhAnh,
        doPhanGiai,
        idHangSX,
        giamGia,
        trangThai: true,
        mauSchema: [{ mau, soLuong, giaTien }],
      });
      const new_dienThoai = await newSanPham.save();
      msg = "Thêm mới thành công";
      res.json({ msg: msg, new_dienThoai: new_dienThoai });
    }
  } catch (error) {
    msg = error.message;
    res.json({ msg: msg });
  }
};

// lấy tất cả các dữ liệu
exports.listsanPham = async (req, res, next) => {
  try {
    const sanPham = await DienThoai.find({ trangThai: true });
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// lấy sản phẩm mới nhất
exports.listProductBestNew = async (req, res, next) => {
  try {
    const latestProducts = await DienThoai.find()
      .sort({ _id: -1 }) // Sort by _id field in descending order
      .limit(6); // Populate the idHangSX field

    res.json(latestProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//lấy sản phẩm hot nhất
exports.listProductHottest = async (req, res, next) => {
  try {
    // Thực hiện một truy vấn phức tạp với các bước xử lý dữ liệu trong MongoDB
    const hotProducts = await sanPhamYTModel.aggregate([
      //  Gom nhóm các sản phẩm theo `id_sanPham` và đếm số lần được yêu thích
      {
        $group: {
          _id: "$id_sanPham", // Sử dụng `id_sanPham` để gom nhóm
          soLuotYeuThich: { $sum: 1 } // Đếm số lần mỗi sản phẩm được yêu thích
        }
      },
      //  Sắp xếp các sản phẩm theo số lượt yêu thích từ cao đến thấp
      { $sort: { soLuotYeuThich: -1 } }, // Sắp xếp giảm dần theo `soLuotYeuThich`
      //  Kết nối với collection `DienThoai` để lấy thông tin chi tiết sản phẩm
      {
        $lookup: {
          from: "DienThoai", // Collection `DienThoai` trong MongoDB
          localField: "_id", // Trường `_id` từ kết quả nhóm (chính là `id_sanPham`)
          foreignField: "_id", // Trường `_id` trong collection `DienThoai`
          as: "sanPhamDetails" // Kết quả sẽ lưu trong trường `sanPhamDetails`
        }
      },
      //  Giải nén mảng `sanPhamDetails` để lấy dữ liệu từng sản phẩm
      { $unwind: "$sanPhamDetails" }, // Mỗi phần tử `sanPhamDetails` sẽ là một đối tượng riêng biệt
      //Chọn các trường cần thiết để trả về cho người dùng
      {
        $project: {
          _id: 0, // Không trả về trường `_id` mặc định
          _id: "$sanPhamDetails._id", // Lấy `_id` của sản phẩm từ `sanPhamDetails`
          tenDienThoai: "$sanPhamDetails.tenDienThoai", // Tên điện thoại
          soLuotYeuThich: 1, // Số lượt yêu thích
          camera: "$sanPhamDetails.camera", // Thông tin camera sau
          cameraTruoc: "$sanPhamDetails.cameraTruoc", // Thông tin camera trước
          kichThuoc: "$sanPhamDetails.kichThuoc", // Kích thước
          cPU: "$sanPhamDetails.cPU", // CPU
          ram: "$sanPhamDetails.ram", // RAM
          sim: "$sanPhamDetails.sim", // SIM
          pin: "$sanPhamDetails.pin", // Pin
          heDieuHanh: "$sanPhamDetails.heDieuHanh", // Hệ điều hành
          namSanXuat: "$sanPhamDetails.namSanXuat", // Năm sản xuất
          congNgheManHinh: "$sanPhamDetails.congNgheManHinh", // Công nghệ màn hình
          moTaThem: "$sanPhamDetails.moTaThem", // Mô tả thêm
          hinhAnh: "$sanPhamDetails.hinhAnh", // Hình ảnh
          doPhanGiai: "$sanPhamDetails.doPhanGiai", // Độ phân giải
          giamGia: "$sanPhamDetails.giamGia", // Giảm giá
          trangThai: "$sanPhamDetails.trangThai", // Trạng thái
          mauSchema: "$sanPhamDetails.mauSchema", // Thông tin màu sắc
          idHangSX: "$sanPhamDetails.idHangSX" // ID hãng sản xuất
        }
      }
    ]);

    // Trả về danh sách các sản phẩm hot nhất
    res.json(hotProducts);
  } catch (err) {
    // Xử lý lỗi nếu có vấn đề xảy ra
    console.error('Error fetching hot products:', err); // In ra lỗi
    res.status(500).json({ message: err.message }); // Trả về lỗi cho client
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
//lấy theo hãng
exports.getSanPhamByIdHang = async (req, res) => {
  try {
    const sanPham = await DienThoai.find({ idHangSX: req.params.id });
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//tìm kiếm sản phâm thoe tên gần giống
exports.searchSanPham = async (req, res, next) => {
  try {
    //lấy tên sản phẩm tử request body
    const { tenDienThoai } = req.body;
    //tìm kiếm các sản phẩm có ten gần giống với tên được gửi lên
    const sanPham = await DienThoai.find({
      tenDienThoai: { $regex: tenDienThoai, $options: "i" },
    });
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//sửa sản phẩm
exports.updatesanPham = async (req, res, next) => {
  try {
    console.log("Incoming request:", req.body);

    let id = req.params.id;
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
      giamGia,
      trangThai,
    } = req.body;

    console.log("Product ID:", id);

    // Check if the product exists
    const existingProduct = await DienThoai.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    console.log("Existing product found:", existingProduct);

    // Handle image upload
    let imageUrl = existingProduct.hinhAnh; // Use existing image URLs as default
    const files = req.files;

    if (files && files.length > 0) {
      console.log("Files received for upload:", files);
      const uploadPromises = files.map((file) => uploadImage(file, nameFolder));
      imageUrl = await Promise.all(uploadPromises);
      console.log("New image URLs:", imageUrl);
    }

    // Update product information
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
    existingProduct.congNgheManHinh =
      congNgheManHinh || existingProduct.congNgheManHinh;
    existingProduct.moTaThem = moTaThem || existingProduct.moTaThem;
    existingProduct.doPhanGiai = doPhanGiai || existingProduct.doPhanGiai;
    existingProduct.mau = mau || existingProduct.mau;
    existingProduct.soLuong = soLuong || existingProduct.soLuong;
    existingProduct.giaTien = giaTien || existingProduct.giaTien;
    existingProduct.giamGia = giamGia || existingProduct.giamGia;
    existingProduct.trangThai = trangThai || existingProduct.trangThai;
    existingProduct.hinhAnh = imageUrl.join(", ") || existingProduct.hinhAnh;

    const updatedProduct = await existingProduct.save();
    console.log("Product updated successfully:", updatedProduct);

    res.json({ msg: "Sửa thành công", updatedProduct: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.getSanPhamByRom = async (req, res) => {
  try {
    const sanPham = await DienThoai.find({ ram: req.params.ram });
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//filter
exports.filterSanPham = async (req, res) => {
  try {
    const { idHangSx, giaMin, giaMax, cpu, ram, kichThuoc } = req.query;
    let filter = { trangThai: true };

    if (idHangSx) {
      filter.idHangSX = idHangSx;
    }
    // Xử lý khi chỉ có giá tối thiểu (min) được truyền
    if (giaMin && !giaMax) {
      filter.giaTien = { $gte: parseInt(giaMin) };
    }

    // Xử lý khi cả hai giá tối thiểu và tối đa được truyền
    if (giaMin && giaMax) {
      filter.giaTien = { $gte: parseInt(giaMin), $lte: parseInt(giaMax) };
    }
    if (cpu) {
      // Sử dụng regex để tìm kiếm CPU tương đối
      filter.cPU = { $regex: new RegExp(cpu, "i") };
    }

    if (ram) {
      filter.ram = { $regex: new RegExp(ram, "i") };
    }
    if (kichThuoc) {
      filter.kichThuoc = kichThuoc;
    }

    const sanPham = await DienThoai.find(filter);
    res.json(sanPham);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//top sanpham bán chảy
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topSellingProducts = await donHangModel.aggregate([
      // Step 1: Filter orders with status "Đã giao hàng"
      { $match: { trangThaiDonHang: "Đã giao hàng" } },
      
      // Step 2: Unwind the 'sp' array to calculate quantities for each product
      { $unwind: "$sp" },
      
      // Step 3: Group orders by product ID and calculate the total quantity sold
      {
        $group: {
          _id: "$sp.idSP", // Group by product ID
          totalQuantitySold: { $sum: "$sp.soLuong" }, // Sum the quantity of each product
        }
      },
      
      // Step 4: Sort products by the total quantity sold in descending order
      { $sort: { totalQuantitySold: -1 } },
      
      // Step 5: Limit the results to the top 10 best-selling products
      { $limit: 10 },
      
      // Step 6: Lookup details of each product from the 'DienThoai' collection
      {
        $lookup: {
          from: "DienThoai",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      
      // Step 7: Unwind the 'productDetails' array to get individual product data
      { $unwind: "$productDetails" },
      
      // Step 8: Project the necessary fields to return to the client
      {
        $project: {
          _id: 0,
          _id: "$productDetails._id",
          tenDienThoai: "$productDetails.tenDienThoai",
          totalQuantitySold: 1,
          camera: "$productDetails.camera",
          cameraTruoc: "$productDetails.cameraTruoc",
          kichThuoc: "$productDetails.kichThuoc",
          cPU: "$productDetails.cPU",
          ram: "$productDetails.ram",
          sim: "$productDetails.sim",
          pin: "$productDetails.pin",
          heDieuHanh: "$productDetails.heDieuHanh",
          namSanXuat: "$productDetails.namSanXuat",
          congNgheManHinh: "$productDetails.congNgheManHinh",
          moTaThem: "$productDetails.moTaThem",
          hinhAnh: "$productDetails.hinhAnh",
          doPhanGiai: "$productDetails.doPhanGiai",
          giamGia: "$productDetails.giamGia",
          trangThai: "$productDetails.trangThai",
          mauSchema: "$productDetails.mauSchema",
          idHangSX: "$productDetails.idHangSX"
        }
      }
    ]);

    // Return the top 10 best-selling products
    res.json(topSellingProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
//trạng thái sản phẩm
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await DienThoai.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }
    product.trangThai = !product.trangThai; // Toggle the status
    await product.save();
    res
      .status(200)
      .json({ message: "Trạng thái sản phẩm đã được cập nhật.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Màu
// exports.addColor = async (req, res) => {
//   try {
//       const productId = req.params.id; // ID của sản phẩm
//       const colorData = req.body; // Dữ liệu của màu từ request body
//       // Tìm sản phẩm theo ID
//       const product = await DienThoai.findById(productId);
//       if (!product) {
//           return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//       }

//       // Thêm màu mới vào mảng màu của sản phẩm
//       product.mauSchema.push(colorData);
//       await product.save();

//       res.status(201).json({ message: "màu mới đã được thêm vào sản phẩm" });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };
exports.addColor = async (req, res) => {
  try {
    const { mau, soLuong, giaTien } = req.body;
    const newMau = { mau, soLuong, giaTien };
    const dienthoai = await findProductById(req.params.id);

    dienthoai.mauSchema.push(newMau);
    await dienthoai.save();
    res.json({ message: "Thêm màu thành công", dienthoai });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateColor = async (req, res) => {
  try {
    const productId = req.params.productId; // ID của sản phẩm
    const mauId = req.params.mauId; // ID của màu
    const newData = req.body; // Dữ liệu mới của màu từ request body

    // Tìm sản phẩm theo ID
    const product = await DienThoai.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm và cập nhật màu trong mảng màu của sản phẩm
    const mau = product.mauSchema.id(mauId);
    if (!mau) {
      return res.status(404).json({ message: "màu không tồn tại" });
    }

    mau.set(newData); // Cập nhật dữ liệu mới của màu
    await product.save();

    res.json({ message: "Thông tin của màu đã được cập nhật" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

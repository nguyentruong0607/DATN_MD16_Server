const {sanPhamYTModel} = require('../../model/sanPhamYT');

// thêm hang sx
exports.createsanPhamYT= async (req, res, next) => {
    try {
        const { id_sanPham, id_user } = req.body;
        // Kiểm tra xem đã tồn tại hay chưa
        const existingYT = await sanPhamYTModel.findOne({ id_sanPham, id_user });

        if (existingYT) {
            // Nếu đã tồn tại, xóa bản ghi cũ
            await sanPhamYTModel.findOneAndDelete({ id_sanPham, id_user });
            return res.status(200).json({ success: false,message:"Đã xóa sản phẩm yêu thích!" });
        } else {
            // Nếu chưa tồn tại, thêm mới
            const newYT = new SanPhamYT({ id_sanPham, id_user });
            const savedYT = await newYT.save();
            return res.status(201).json({ success: true,message:"Đã thêm sản phẩm yêu thích!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
 
};

// lấy tất cả các dữ liệu
exports.listsanPhamYT= async (req, res, next) => {
  try {
    const sanPhamYT= await sanPhamYTModel.find();
    if (sanPhamYT.length > 0) {
      res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm yêu thích thành công", data: sanPhamYT});
    } else {
      res.json({ status: 204, msg: "Không có dữ liệu sản phẩm yêu thích", data: [] });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: [] });
  }
};
exports.checkYeuThich = async (req, res) => {
    try {
        const {id_sanPham, id_user } = req.body;
        // Kiểm tra xem đã tồn tại hay chưa
        const existingYT = await SanPhamYT.findOne({ id_sanPham, id_user });
        if (existingYT) {
            return res.status(200).json({ success: true});
        } else {
            return res.status(201).json({ success: false});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
// LẤY THEO ID
exports.getSanPhamYTById = async (req, res, next) => {
  try {
    const sanPhamYT= await sanPhamYTModel.findById(req.params.id);
    if (sanPhamYT) {
      res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm yêu thích thành công", data: sanPhamYT});
    } else {
      res.json({ status: 204, msg: "Không tìm thấy sản phẩm yêu thích", data: null });
    }
  } catch (err) {
    res.json({ status: 500, msg: err.message, data: null });
  }
};





// Delete by ID
exports.deletesanPhamYT= async (req, res, next) => {
  try {
    await sanPhamYTModel.deleteOne({ _id: req.params.id });
    res.json({ status: 200, msg: "Xóa sản phẩm yêu thích thành công" });
  } catch (err) {
    res.json({ status: 500, msg: err.message });
  }
};
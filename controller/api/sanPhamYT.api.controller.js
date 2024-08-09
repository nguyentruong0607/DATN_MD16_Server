const mongoose = require('mongoose');
const sanPhamYTModel = require('../../model/sanPhamYT');

// Thêm sản phẩm yêu thích
exports.createsanPhamYT = async (req, res, next) => {
    try {
        const { id_sanPham, id_user } = req.body;

        // Kiểm tra xem đã tồn tại hay chưa
        const existingYT = await sanPhamYTModel.findOne({ id_sanPham, id_user });

        if (existingYT) {
            // Nếu đã tồn tại, xóa bản ghi cũ
            await sanPhamYTModel.findOneAndDelete({ id_sanPham, id_user });
            return res.status(200).json({ success: false, message: "Đã xóa sản phẩm yêu thích!" });
        } else {
            // Nếu chưa tồn tại, thêm mới
            const newYT = new sanPhamYTModel({ id_sanPham, id_user });
            const savedYT = await newYT.save();
            return res.status(201).json({ success: true, message: "Đã thêm sản phẩm yêu thích!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả các dữ liệu
exports.listsanPhamYT = async (req, res, next) => {
    try {
        const sanPhamYT = await sanPhamYTModel.find();
        if (sanPhamYT.length > 0) {
            res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm yêu thích thành công", data: sanPhamYT });
        } else {
            res.json({ status: 204, msg: "Không có dữ liệu sản phẩm yêu thích", data: [] });
        }
    } catch (err) {
        res.json({ status: 500, msg: err.message, data: [] });
    }
};

// Kiểm tra yêu thích
exports.checkYeuThich = async (req, res) => {
    try {
        const { id_sanPham, id_user } = req.body;

        // Kiểm tra xem đã tồn tại hay chưa
        const existingYT = await sanPhamYTModel.findOne({ id_sanPham, id_user });
        if (existingYT) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(201).json({ success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm yêu thích theo ID user
exports.getSanPhamYTByIdAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Ensure id is treated as a string or ObjectId
        const sanPhamYT = await sanPhamYTModel.findOne({ id_user: id });

        if (sanPhamYT) {
            res.json({ status: 200, msg: "Lấy dữ liệu sản phẩm yêu thích thành công", data: sanPhamYT });
        } else {
            res.json({ status: 204, msg: "Không tìm thấy sản phẩm yêu thích", data: null });
        }
    } catch (err) {
        res.json({ status: 500, msg: err.message, data: null });
    }
};

// Xóa sản phẩm yêu thích theo ID
exports.deletesanPhamYT = async (req, res, next) => {
    try {
        await sanPhamYTModel.deleteOne({ _id: req.params.id });
        res.json({ status: 200, msg: "Xóa sản phẩm yêu thích thành công" });
    } catch (err) {
        res.json({ status: 500, msg: err.message });
    }
};

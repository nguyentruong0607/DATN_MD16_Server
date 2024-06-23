const dienThoai = require('../model/sanPham');
const hangsxModel = require('../model/hangSX');
const fs = require('fs');
const path = require('path');

// Hiển thị danh sách sản phẩm
exports.getAllSP = async (req, res, next) => {
    try {
        const list = await dienThoai.DienThoai.find();
        res.render('sanPham/list', { listSP: list, msg: 'Lấy dữ liệu thành công !' });
    } catch (error) {
        console.error('Error in getAllSP:', error);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu sản phẩm' });
    }
};

// Thêm sản phẩm vào hệ thống
// exports.add = async (req, res) => {
//     try {
//         if (req.method !== 'POST') {
//             // If request method is not POST, return a 405 Method Not Allowed
//             return res.status(405).json({ message: 'Method Not Allowed' });
//         }

//         // Ensure required fields are present in the request body
//         const requiredFields = ['tenDienThoai', 'idHangSx', 'cameraTruoc', 'kichThuoc', 'cPU', 'ram', 'sim', 'heDieuHanh', 'namSanXuat', 'hinhAnh', 'doPhanGiai'];
//         for (const field of requiredFields) {
//             if (!req.body[field]) {
//                 return res.status(400).json({ message: `Missing required field: ${field}` });
//             }
//         }

//         // Move the uploaded file to a specific directory
//         const newPath = path.join(__dirname, '../public/uploads/', req.file.originalname);
//         fs.rename(req.file.path, newPath, (err) => {
//             if (err) {
//                 console.error('Error moving file:', err);
//                 return res.status(500).json({ message: 'Failed to move uploaded file' });
//             }
//             console.log('File moved successfully to:', newPath);
//         });

//         // Create new product data object
//         const newProductData = {
//             tenDienThoai: req.body.tenDienThoai,
//             idHangSx: req.body.idHangSx,
//             hinhAnh: req.file.filename, // Assuming req.file.filename is correct
//             camera: req.body.camera,
//             cameraTruoc: req.body.cameraTruoc,
//             congNgheManHinh: req.body.congNgheManHinh,
//             ram: req.body.ram,
//             dungLuong: req.body.dungLuong,
//             soLuong: req.body.soLuong,
//             giaTien: req.body.giaTien,
//             mau: req.body.mau,
//             moTa: req.body.moTa,
//             cPU: req.body.cPU,
//             pin: req.body.pin,
//             sim: req.body.sim,
//             kichThuoc: req.body.kichThuoc,
//             doPhanGiai: req.body.doPhanGiai,
//             heDieuHanh: req.body.heDieuHanh,
//             namSanXuat: req.body.namSanXuat,
//             moTaThem: req.body.moTaThem,
//         };

//         // Save new product to database
//         await dienThoai.DienThoai.create(newProductData);
//         res.redirect('/sanPham');
//     } catch (error) {
//         console.error('Error in add:', error);
//         res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
//     }
// };
exports.add = async (req, res) => {
    try {
        // Lấy danh sách hãng sản xuất 
        const user = req.session.account;
        const listHangSx = await hangsxModel.find(); 
        res.render('sanPham/add', {
            title: "Thêm sản phẩm mới",
            listHangSX: listHangSx ,
            user :  user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
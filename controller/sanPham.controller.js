const dienThoai = require('../model/sanPham');
const hangsxModel = require('../model/hangSX');
const fs = require('fs');


// Hiển thị danh sách sản phẩm
exports.getAllSP = async (req, res, next) => {
    try {
        const list = await dienThoai.DienThoai.find();
        res.render('sanPham/list', { listSP: list, msg: 'Lấy dữ liệu thành công !' ,title:'Quản lý sản phẩm'});
    } catch (error) {
        console.error('Error in getAllSP:', error);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu sản phẩm' });
    }
};
// chi tiết sản phẩm
exports.chiTiet=async(req, res, next)=>{
    try {
        const user=req.session.account;
        const dienthoai=await dienThoai.DienThoai.findById(req.params.id);
        res.render('sanPham/chiTiet',{title:'Chi tiết sản phẩm',dienthoai:dienthoai,user:user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// exports.add = async (req, res, next) => {
//     if (req.method === 'POST') {
//         console.log(req.file);
//         if (req.file) {
//             fs.rename(req.file.path, "./public/uploads/" + req.file.originalname, (err) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log('http://localhost:3000/uploads/' + req.file.originalname);
//                 }
//             });
//         } else {
//             console.log('No file uploaded'); // Debugging line
//         }
//     }

//     try {
        
//         const newSanPham = new dienThoai.DienThoai();
//             newSanPham.idHangSX=req.body.idHangSX;
//             newSanPham.tenDienThoai=req.body.tenDienThoai;
//             newSanPham.hinhAnh=req.file.originalname;
//             newSanPham.camera= req.body.camera;
//             newSanPham.cameraTruoc=req.body.cameraTruoc;
//             newSanPham.kichThuoc=req.body.kichThuoc;
//             newSanPham.cPU=req.body.cPU;
//             newSanPham.ram=req.body.ram;
//             newSanPham.sim=req.body.sim;
//             newSanPham.pin=req.body.pin;
//             newSanPham.heDieuHanh=req.body.heDieuHanh;
//             newSanPham.namSanXuat=req.body.namSanXuat;
//             newSanPham.congNgheManHinh=req.body.congNgheManHinh;
//             newSanPham.doPhanGiai=req.body.doPhanGiai;
//             newSanPham.moTaThem=req.body.moTaThem;
//             newSanPham.mau=req.body.mau;
//             newSanPham.giaTien=req.body.giaTien;
//             newSanPham.soLuong=req.body.soLuong
        

//         await newSanPham.save();
//         res.json({ message: 'Thêm sản phẩm thành công' });
//     } catch (error) {
//         console.error('Lỗi thêm sản phẩm:', error);
//         res.status(500).json({ error: 'Thêm sản phẩm thất bại' });
//     }
// };
exports.add = async (req, res) => {
    try {
        // Lấy danh sách hãng sản xuất 
        const user = req.session.account;
        const listHangSx = await hangsxModel.find(); 
        res.render('sanPham/add', {
            title: "Thêm sản phẩm mới",
            listHangSx: listHangSx ,
            user :  user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//tìm kiếm
exports.search = async (req, res, next) => {
    const queryValue = req.query.query;
    const user = req.session.account;
    try {
        if (queryValue.lenght === 0) {
            const listSanPham = await dienThoai.DienThoai.find();
            res.render('sanPham/list',{title: "Quản lý sản phẩm",listSP: listSanPham , user :  user});
        }
        else {
            const listSanPham = await dienThoai.DienThoai.find({ tenDienThoai: { $regex: queryValue, $options: 'i' } });
            res.render('sanPham/list',{title: "Quản lý sản phẩm",listSP: listSanPham , user :  user});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
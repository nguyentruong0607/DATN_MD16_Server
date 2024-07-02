const dienThoai = require('../model/sanPham');
const hangsxModel = require('../model/hangSX');
const fs = require('fs');
const path = require('path');

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
//thêm sản phẩm
exports.add = async (req, res, next) => {
    if (req.method === 'POST') {
        if (req.file) {
            const filePath = path.join(__dirname, '../public/uploads', req.file.originalname);
            fs.rename(req.file.path, filePath, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File uploaded to: ' + filePath);
                }
            });
        } else {
            console.log('No file uploaded');
        }

        const { idHangSX, tenDienThoai, camera, cameraTruoc, kichThuoc, cPU, ram, sim, heDieuHanh, pin, namSanXuat, congNgheManHinh, moTaThem, hinhAnh, doPhanGiai, mau, soLuong, giaTien, giaGoc, giamGia, trangThai } = req.body;

        try {
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
                hinhAnh,
                doPhanGiai,
                idHangSX,
                giaGoc,
                giamGia,
                trangThai: true
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
                    hinhAnh,
                    doPhanGiai,
                    idHangSX,
                    giaGoc,
                    giamGia,
                    trangThai: true,
                    mauSchema: [{ mau, soLuong, giaTien }]
                });
                await newSanPham.save();
            }
            res.redirect('/sanPham');
        } catch (error) {
            console.error('Lỗi thêm sản phẩm:', error);
            res.status(500).json({ error: 'Thêm sản phẩm thất bại' });
        }
    } else {
        try {
            const user = req.session.account;
            const listHangSx = await hangsxModel.find();
            res.render('sanPham/add', { title: "Thêm sản phẩm mới", listHangSx: listHangSx, user: user });
        } catch (error) {
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
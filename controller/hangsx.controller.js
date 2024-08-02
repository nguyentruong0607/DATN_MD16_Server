const DienThoai = require('../model/sanPham');
const hangSX=require('../model/hangSX');
const hangsxModel = require('../model/hangSX');

// Hiển thị tất cả
exports.getAll = async (req, res, next) => {
    let msg = '';
    let list = [];
    const trangThai = req.query.trangThai || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    try {
        const totalItems = await hangSX.countDocuments();
        list = await hangSX.find().skip(skip).limit(perPage);
        const totalPages = Math.ceil(totalItems / perPage);

        msg = 'Lấy dữ liệu thành công!';
        res.render('hangsx/list', { 
            listHangSX: list, 
            msg: msg, 
            title: 'Quản lý hãng', 
            trangThai, 
            currentPage: page, 
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1
        });
    } catch (error) {
        console.log(error);
        msg = 'Lỗi: ' + error.message;
        res.render('hangsx/list', { msg: msg, title: 'Quản lý hãng', trangThai });
    }
};

//Thêm
exports.addHangsx = async (req, res, next) => {
    let msg = '';
    const trangThai = req.query.trangThai || ''; // Get the trangThai from query parameters or default to an empty string

    if (req.method === "POST") {
        try {
            let existingHang = await hangSX.findOne({ tenHang: req.body.tenHang });
            if (existingHang) {
                msg = 'Hãng sản xuất này đã tồn tại!';
            } else {
                let objC = new hangSX({
                    tenHang: req.body.tenHang,
                    trangThai: true
                });

                await objC.save();
                msg = 'Thêm thành công!';
                return res.redirect('/hangsx');
            }
        } catch (error) {
            msg = error.message;
        }
    }

    const list = await hangSX.find(); // Fetch the list of hangSX
    res.render('hangsx/list', { msg: msg, title: 'Quản lý hãng', listHangSX: list, trangThai }); // Include trangThai in the render call
};




// xử lý chỉnh sửa 
// exports.updateHangSX = async (req, res, next) => {
//     let msg = '';    
//     try {
//         let id_c = req.params.id;

//         if(req.method == "POST"){            
//             let objc = {};
//             objc.tenHang = req.body.tenHang;
            
//             await hangSX.findByIdAndUpdate(id_c,objc);
//             msg ="Cập nhập thành công!"
//             res.redirect('/hangsx');
//         }
//     } catch (error) {
//         msg ="Lỗi: "+ error.message;
//     }
 
// };
exports.updateHangSX = async (req, res, next) => {
    let id = req.params.id;
    const hangOld = await hangSX.findById(id)
    let trangThai = req.body.trangThai === 'True' ? true : false;
    console.log(trangThai)
    hangOld.trangThai = trangThai;
    hangOld.tenHang = req.body.tenHang;
    console.log(hangOld)
    try {
        await hangOld.save();
        res.redirect('/hangsx')
    }
    catch (error) {
        res.render("Error/err", { msg: error });
    }
}  
//Xóa
exports.deleteHangSX = async (req, res, next) => {
    let id_c = req.params.id;
    let msg = '';
    try {
        await hangSX.findByIdAndDelete(id_c);
        msg = "Xóa thành công";
        return res.redirect('/hangsx');
    } catch (error) {
        msg = error.message;
        res.render('hangsx/list', { msg: msg });
    }
};
//tìm kiếm
exports.search = async (req, res, next) => {
    const queryValue = req.query.query;
    const user = req.session.account;
    try {
        if (queryValue.lenght === 0) {
            const listHang = await hangSX.find();
            res.render('hangsx/list', { title: "Quản lý hãng", listHang: listHang, user: user });
        }
        else {
            const listHang = await hangSX.find({ tenHang: { $regex: queryValue, $options: 'i' } });
            res.render('hangsx/list', { title: "Quản lý hãng", listHangSX: listHang, user: user });
        }
    }
    catch (error) {
        res.render("Error/err", { msg: error });
    }
}
//lấy danh sách theo trạng thái
exports.getByTrangThai = async (req, res, next) => {
    let msg = '';
    let list = [];
    const trangThai = req.query.trangThai || ''; 
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    try {
        let totalItems;
        if (trangThai === '') {
            totalItems = await hangSX.countDocuments();
            list = await hangSX.find().skip(skip).limit(perPage);
        } else {
            const booleanTrangThai = trangThai === 'true';
            totalItems = await hangSX.countDocuments({ trangThai: booleanTrangThai });
            list = await hangSX.find({ trangThai: booleanTrangThai }).skip(skip).limit(perPage);
        }

        const totalPages = Math.ceil(totalItems / perPage);
        msg = 'Lấy dữ liệu thành công!';

        res.render('hangsx/list', {
            listHangSX: list,
            msg: msg,
            title: 'Quản lý hãng',
            trangThai,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
        });
    } catch (error) {
        console.log(error);
        msg = 'Lỗi: ' + error.message;
        res.render('hangsx/list', { msg: msg, title: 'Quản lý hãng', trangThai });
    }
};

  
//lấy theo hãng
exports.getSanPhamByIdHang = async (req, res) => {
    let id = req.params.id;
    let hangsx= await hangSX.findById(id);
        const sanPham = await DienThoai.DienThoai.find({ idHangSX: req.params.id});
        res.render("sanPham/listSPofHang",{title:'Quản lý hãng',hangsx:hangsx,sanPham:sanPham});
    
  };
  
  

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
        let filter = {};
        if (trangThai !== '') {
            filter.trangThai = trangThai === 'true';
        }

        // Tính tổng số tài liệu theo bộ lọc
        const totalItems = await hangSX.countDocuments(filter);
        // Lấy dữ liệu phân trang theo bộ lọc
        list = await hangSX.find(filter).skip(skip).limit(perPage);
        // Tính tổng số trang
        const totalPages = Math.ceil(totalItems / perPage);

        msg = 'Lấy dữ liệu thành công!';
        res.render('hangsx/list', { 
            listHangSX: list, 
            msg: msg, 
            title: 'Quản lý hãng', 
            trangThai, 
            currentPage: page, // Make sure currentPage is defined here
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            perPage,
            error: null
        });
    } catch (error) {
        console.log(error);
        msg = 'Lỗi: ' + error.message;
        res.render('hangsx/list', { 
            msg: msg, 
            title: 'Quản lý hãng', 
            trangThai 
        });
    }
};

// Thêm
exports.addHangsx = async (req, res, next) => {
    let error = null;
    const trangThai = req.query.trangThai || '';
    const page = 1;  // Always go back to the first page after adding a new item
    const perPage = 6;

    if (req.method === "POST") {
        try {
            let existingHang = await hangSX.findOne({ tenHang: req.body.tenHang });
            if (existingHang) {
                error = 'Hãng sản xuất này đã tồn tại!';
            } else {
                let objC = new hangSX({
                    tenHang: req.body.tenHang,
                    trangThai: true
                });

                await objC.save();
                return res.redirect('/hangsx');
            }
        } catch (error) {
            error = error.message;
        }
    }

    try {
        const totalItems = await hangSX.countDocuments();
        const list = await hangSX.find().skip(0).limit(perPage);
        const totalPages = Math.ceil(totalItems / perPage);

        res.render('hangsx/list', { 
            listHangSX: list, 
            title: 'Quản lý hãng', 
            trangThai, 
            currentPage: page, 
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            perPage,
            error: error
        });
    } catch (error) {
        res.render('hangsx/list', { 
            title: 'Quản lý hãng', 
            trangThai, 
            error: 'Lỗi: ' + error.message,
            currentPage: page,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: 1,
            previousPage: 1,
            perPage
        });
    }
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
    const hangOld = await hangSX.findById(id);
    let trangThai = req.body.trangThai === 'True' ? true : false;

    hangOld.trangThai = trangThai;
    hangOld.tenHang = req.body.tenHang;

    try {
        await hangOld.save();

        // Update the products associated with this manufacturer based on the new status
        await DienThoai.DienThoai.updateMany({ idHangSX: id }, { $set: { trangThai: trangThai } });

        res.redirect('/hangsx');
    } catch (error) {
        res.render("Error/err", { msg: error });
    }
};

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
    const queryValue = req.query.query || '';
    const trangThai = req.query.trangThai || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    try {
        let filter = {};
        if (queryValue.length > 0) {
            filter.tenHang = { $regex: queryValue, $options: 'i' };
        }
        if (trangThai !== '') {
            filter.trangThai = trangThai === 'true';
        }

        const totalItems = await hangSX.countDocuments(filter);
        const list = await hangSX.find(filter).skip(skip).limit(perPage);
        const totalPages = Math.ceil(totalItems / perPage);

        res.render('hangsx/list', { 
            title: "Quản lý hãng", 
            listHangSX: list, 
            trangThai,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            perPage,
            error: null
        });
    } catch (error) {
        res.render('hangsx/list', { 
            title: "Quản lý hãng", 
            trangThai,
            currentPage: page,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: 1,
            previousPage: 1,
            perPage,
            error: 'Lỗi: ' + error.message
        });
    }
};



//lấy danh sách theo trạng thái
exports.getByTrangThai = async (req, res, next) => {
    const trangThai = req.query.trangThai || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;

    try {
        let filter = {};
        if (trangThai !== '') {
            filter.trangThai = trangThai === 'true';
        }

        const totalItems = await hangSX.countDocuments(filter);
        const list = await hangSX.find(filter).skip(skip).limit(perPage);
        const totalPages = Math.ceil(totalItems / perPage);

        res.render('hangsx/list', { 
            listHangSX: list, 
            title: 'Quản lý hãng', 
            trangThai, 
            currentPage: page, 
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            perPage,
            error: null
        });
    } catch (error) {
        res.render('hangsx/list', { 
            title: 'Quản lý hãng', 
            trangThai, 
            error: 'Lỗi: ' + error.message,
            currentPage: page,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: 1,
            previousPage: 1,
            perPage
        });
    }
};

  
//lấy theo hãng
exports.getSanPhamByIdHang = async (req, res) => {
    let id = req.params.id;
    let hangsx= await hangSX.findById(id);
        const sanPham = await DienThoai.DienThoai.find({ idHangSX: req.params.id});
        res.render("sanPham/listSPofHang",{title:'Quản lý hãng',hangsx:hangsx,sanPham:sanPham});
    
  };
  
  

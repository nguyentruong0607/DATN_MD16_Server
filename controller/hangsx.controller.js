const hangSX=require('../model/hangSX');

//Hiển thị
exports.getAll = async (req, res, next) => {

    let msg = '';
    let list = [];
    try {
        list = await hangSX.find();
        msg = 'Lấy dữ liệu thành công !'
    } catch (error) {
        console.log(error);
    }
    res.render('hangsx/list', { listHangSX: list, msg: msg, title:'Quản lý hãng'})
}

//Thêm
exports.addHangsx = async (req, res, next) => {
    let msg = '';
    if (req.method === "POST") {
        try {
            // Kiểm tra xem hãng sản xuất đã tồn tại hay chưa
            let existingHang = await hangSX.findOne({ tenHang: req.body.tenHang });
            if (existingHang) {
                msg = 'Hãng sản xuất này đã tồn tại!';
            } else {
                // Tạo một đối tượng mới từ model và lưu vào cơ sở dữ liệu
                let objC = new hangSX({
                    tenHang: req.body.tenHang,
                });

                await objC.save();
                msg = 'Thêm thành công!';
                return res.redirect('/hangsx');
            }
        } catch (error) {
            msg = error.message;
        }
    }

    res.render('hangsx/list', { msg: msg });
};


// xử lý chỉnh sửa 
exports.updateHangSX = async (req, res, next) => {
    let msg = '';    
    try {
        let id_c = req.params.id;

        if(req.method == "POST"){            
            let objc = {};
            objc.tenHang = req.body.tenHang;
            
            await hangSX.findByIdAndUpdate(id_c,objc);
            msg ="Cập nhập thành công!"
            res.redirect('/hangsx');
        }
    } catch (error) {
        msg ="Lỗi: "+ error.message;
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
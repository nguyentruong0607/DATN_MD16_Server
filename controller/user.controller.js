const User=require('../model/account');
const DonHang= require('../model/donHang');
//Hiển thị
exports.getAll = async (req, res, next) => {
    let msg = '';
    let list = [];
    const trangThai = req.query.trangThai || '';

    try {
        if (trangThai === '') {
            list = await User.find();
        } else {
            const status = trangThai === 'true';
            list = await User.find({ trangThai: status });
        }
        msg = 'Lấy dữ liệu thành công!';
    } catch (error) {
        console.log(error);
        msg = 'Lỗi lấy dữ liệu!';
    }
    res.render('user/list', { listUser: list, msg: msg, title: 'Quản lý người dùng', trangThai });
};

exports.update = async (req, res, next)=>{
    let user = {};
    let id = req.params.id ;
    const objU = await User.findById(id);
    let trangThai = req.body.trangThai === 'True' ? true : false;
    objU.trangThai=trangThai;
    try {
        await objU.save();
        return res.redirect('/user');
    } catch (error) {
    console.log(error);
    }
}
exports.search = async (req, res , next )=>{
    try{
        const user = req.session.Account;
        let queryValue = req.query.query;
        if(queryValue.lenght === 0){
            let listUser = [];
            listUser = await User.find()
            res.render('user/list',{title:"Quản lý ngươi dùng", listUser: listUser,user: user})
        }
        let listUser = [];
        listUser = await User.find({ taiKhoan: { $regex: queryValue, $options: 'i' } });
        res.render('user/list',{title: "Người dùng: '"+queryValue+"'", listUser: listUser, user: user});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
    
}
//lấy danh sách đơn hàng của user
exports.getDonHangOfUser = async (req, res) => {
    let id = req.params.id;
    let user= await User.findById(id);
    const listDH = await DonHang.find({ idKH: req.params.id }).populate('idKH').populate('idSP');
    res.render("user/listDonHangOfUser",{title:'Quản lý người dùng',user:user,listDH:listDH});
    
};
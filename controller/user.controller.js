const User=require('../model/account');
const DonHang= require('../model/donHang');
//Hiển thị
exports.getAll = async (req, res, next) => {
    let msg = '';
    const trangThai = req.query.trangThai || '';
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const skip = (page - 1) * perPage;
    
    try {
        let filter = {};
        if (trangThai !== '') {
            filter.trangThai = trangThai === 'true';
        }
        
        const totalItems = await User.countDocuments(filter);
        const list = await User.find(filter).skip(skip).limit(perPage);
        const totalPages = Math.ceil(totalItems / perPage);

        msg = 'Lấy dữ liệu thành công!';
        
        res.render('user/list', {
            listUser: list,
            msg: msg,
            title: 'Quản lý người dùng',
            trangThai: trangThai,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
        });
    } catch (error) {
        console.log(error);
        msg = 'Lỗi lấy dữ liệu!';
        res.render('user/list', { listUser: [], msg: msg, title: 'Quản lý người dùng', trangThai });
    }
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
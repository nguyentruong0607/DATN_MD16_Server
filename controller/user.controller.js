const User=require('../model/account');
//Hiển thị
exports.getAll = async (req, res, next) => {

    let msg = '';
    let list = [];
    try {
        list = await User.find();
        msg = 'Lấy dữ liệu thành công !'
    } catch (error) {
        console.log(error);
    }
    res.render('user/list', { listUser: list, msg: msg })
}
exports.update = async (req, res, next)=>{
    let user = {};
    try {
        let id = req.params.id ;
        let objU = {};
        objU.taiKhoan = req.body.taiKhoan;
        objU.hoTen = req.body.hoTen;
        objU.sdt = req.body.sdt;
        user = await User.findByIdAndUpdate(id,objU);
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
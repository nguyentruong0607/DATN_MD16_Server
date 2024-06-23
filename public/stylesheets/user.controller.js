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
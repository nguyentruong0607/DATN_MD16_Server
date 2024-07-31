const bcrypt = require('bcrypt');
const accountModel  = require('../../model/account');
const saltRounds = 10; // Define saltRounds for bcrypt

// Create account
exports.createAccount = async (req, res, next) => {
    let msg = '';

    try {
        // Create a model instance and assign data
        let objA = new accountModel();
        //const hashedPassword = await bcrypt.hash(req.body.matKhau, saltRounds); 
        objA.taiKhoan = req.body.taiKhoan;
        objA.hoTen = req.body.hoTen;
        objA.matKhau = req.body.matKhau;
        objA.sdt = req.body.sdt;
        objA.tenQuyen = req.body.tenQuyen;
        objA.trangThai=req.body.trangThai;
        // Save to database
        let new_u = await objA.save();

        msg = "Thêm mới thành công";
        res.json({ msg: msg, new_u: new_u });
    } catch (error) {
        msg = error.message;
        res.json({ msg: msg });
    }
};

// Get all accounts
exports.listAccount = async (req, res, next) => {
    try {
        const account = await accountModel.find();
        if (account.length > 0) {
            res.json({ status: 200, msg: "Lấy dữ liệu thành công", data: account });
        } else {
            res.json({ status: 204, msg: "Không có dữ liệu", data: [] });
        }
    } catch (err) {
        res.json({ status: 500, msg: err.message, data: [] });
    }
};

// Get account by ID
exports.getAccountById = async (req, res, next) => {
    try {
        const account = await accountModel.findById(req.params.id);
        if (account) {
            res.json({ status: 200, msg: "Lấy dữ liệu thành công", data: account });
        } else {
            res.json({ status: 204, msg: "Không tìm thấy", data: null });
        }
    } catch (err) {
        res.json({ status: 500, msg: err.message, data: null });
    }
};

// đăng ký tài khoản
exports.SignUp = async (req, res) => {
    try {
        const { taiKhoan,hoTen, matKhau, sdt } = req.body;
        // Check if account exists
        const existingTaiKhoan = await accountModel.findOne({ taiKhoan: taiKhoan });
        if (existingTaiKhoan) {
            return res.status(200).json({ success: false, message: 'Tài khoản đã tồn tại. Vui lòng nhập tài khoản khác!' });
        }

        // Hash the password
        //const hashedPassword = await bcrypt.hash(matKhau, saltRounds);

        // Create new account
        const newAccount = new accountModel({
            tenQuyen: "User",
            taiKhoan: taiKhoan,
            hoTen:hoTen,
            sdt:sdt,
            matKhau: matKhau,
            trangThai:"true"
        });

        await newAccount.save();
        // Return success
        return res.status(201).json({ success: true, message: 'Đăng ký thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Sign in
exports.signIn = async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;
        // Check if account exists
        const existingAccount = await accountModel.findOne({ taiKhoan,trangThai :true,tenQuyen: 'User' });

        if (!existingAccount) {
            return res.status(200).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }

        // Compare the provided password with the hashed one
       // const match = await bcrypt.compare(matKhau, existingAccount.matKhau);
        if (!matKhau) {
            return res.status(200).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        return res.status(200).json({ success: true, message: 'Đăng nhập thành công!', value: existingAccount._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Cập nhật họ tên, số điện thoại và email của một account dựa trên ID
exports.editAccountInfo = async (req, res) => {
    try {
        const { hoTen, sdt } = req.body;
        const accountId = req.params.id;

        const account = await accountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        }

        // Cập nhật thông tin mới
        if (hoTen) {
            account.hoTen = hoTen;
        }
        if (sdt) {
            account.sdt = sdt;
        }
        

        // Lưu thông tin tài khoản sau khi đã cập nhật
        await account.save();

        res.json({ success: true, message: 'Cập nhật thông tin tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Cập nhật mật khẩu của một tài khoản dựa trên ID
exports.editMatKhau = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Kiểm tra kiểu dữ liệu của mật khẩu hiện tại và mật khẩu mới
        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
            return res.status(200).json({ success: false, message: 'Mật khẩu phải là chuỗi ký tự' });
        }

        const accountId = req.params.id;
        const account = await accountModel.findById(accountId);

        if (!account) {
            return res.status(200).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }

        // Compare the provided password with the stored one
        if (currentPassword !== account.matKhau) {
            return res.status(200).json({ success: false, message: 'Mật khẩu hiện tại không chính xác!' });
        }

        // Kiểm tra chiều dài của mật khẩu mới
        if (newPassword.length < 6 || newPassword.length > 20) {
            return res.status(200).json({ success: false, message: 'Mật khẩu mới phải từ 6 đến 20 ký tự' });
        }

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        account.matKhau = newPassword;  // Storing plain text password
        await account.save();

        res.json({ success: true, message: 'Cập nhật mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
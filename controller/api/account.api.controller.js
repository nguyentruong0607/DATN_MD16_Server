const bcrypt = require('bcrypt');
const { accountModel } = require('../../model/account');
const saltRounds = 10; // Define saltRounds for bcrypt

// Create account
exports.createAccount = async (req, res, next) => {
    let msg = '';

    try {
        // Create a model instance and assign data
        let objA = new accountModel();
        const hashedPassword = await bcrypt.hash(req.body.matKhau, saltRounds); 
        objA.taiKhoan = req.body.taiKhoan;
        objA.hoTen = req.body.hoTen;
        objA.matKhau = hashedPassword;
        objA.sdt = req.body.sdt;
        objA.tenQuyen = req.body.tenQuyen;

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
        const hashedPassword = await bcrypt.hash(matKhau, saltRounds);

        // Create new account
        const newAccount = new accountModel({
            tenQuyen: "User",
            taiKhoan: taiKhoan,
            hoTen:hoTen,
            sdt:sdt,
            matKhau: hashedPassword
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
        const existingAccount = await accountModel.findOne({ taiKhoan, tenQuyen: 'User' });

        if (!existingAccount) {
            return res.status(200).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }

        // Compare the provided password with the hashed one
        const match = await bcrypt.compare(matKhau, existingAccount.matKhau);
        if (!match) {
            return res.status(200).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        return res.status(200).json({ success: true, message: 'Đăng nhập thành công!', value: existingAccount._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

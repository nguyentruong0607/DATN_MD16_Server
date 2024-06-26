const dienThoai = require('../model/sanPham');
const hangsxModel = require('../model/hangSX');
const fs = require('fs');
const path = require('path');
const sanPham = require('../model/sanPham');
const { title } = require('process');

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

exports.add = async (req, res) => {
    try {
        // Lấy danh sách hãng sản xuất 
        const user = req.session.account;
        const listHangSx = await hangsxModel.find(); 
        res.render('sanPham/add', {
            title: "Thêm sản phẩm mới",
            listHangSX: listHangSx ,
            user :  user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
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
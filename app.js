var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var dotenv=require('dotenv');

dotenv.config();
var connectDB=require('./model/db');
connectDB();
// API
var apiHangSXRouter = require("./routes/api/hangSX.api");
var apiSanPhamRouter = require("./routes/api/sanPham.api");
var apiSanPhamYTRouter = require("./routes/api/sanPhamYT.api");
var apiAccountRouter = require("./routes/api/account.api");
var apiDonHangRouter = require("./routes/api/donHang.api");
var apiDanhGiaRouter = require("./routes/api/danhGia.api");
var apiKhuyenMaiRouter = require("./routes/api/khuyenMai.api");
var apiThongBaoRouter = require("./routes/api/thongBao.api");

//web
var loginRouter = require("./routes/login");
var homeRouter= require('./routes/home');
var hangSXRouter=require('./routes/hangsx');
var sanPhamRouter=require('./routes/sanPham');
var usersRouter = require("./routes/users");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//sesison đặt trước router
app.use(
  session({
    secret: "nhNNGHSNFGH83sdf23435Fdzgsfnksjdfh9", // chuỗi ký tự đặc biệt để Session mã hóa, tự viết
    resave: true,
    saveUninitialized: true,
  })
);

// API
app.use("/api/hangsx", apiHangSXRouter);
app.use("/api/sanPham", apiSanPhamRouter);
app.use("/api/sanPhamYT", apiSanPhamYTRouter);
app.use("/api/account", apiAccountRouter);
app.use("/api/donHang", apiDonHangRouter);
app.use("/api/danhGia", apiDanhGiaRouter);
app.use("/api/khuyenMai", apiKhuyenMaiRouter);
app.use("/api/thongBao", apiThongBaoRouter);


//web
app.use('/',homeRouter);
app.use('/login',loginRouter);
app.use('/hangsx',hangSXRouter);
app.use('/sanPham',sanPhamRouter);
app.use('/user',usersRouter);
module.exports = app;

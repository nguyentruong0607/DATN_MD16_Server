var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
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

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// API
app.use("/hangsx", apiHangSXRouter);
app.use("/sanPham", apiSanPhamRouter);
app.use("/sanPhamYT", apiSanPhamYTRouter);
app.use("/account", apiAccountRouter);
app.use("/donHang", apiDonHangRouter);
app.use("/danhGia", apiDanhGiaRouter);
app.use("/khuyenMai", apiKhuyenMaiRouter);
app.use("/thongBao", apiThongBaoRouter);

//web
app.use("/", loginRouter);

module.exports = app;

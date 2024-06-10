var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// API
var apiHangSXRouter=require('./routes/api/hangSX.api');
var apiSanPhamRouter=require('./routes/api/sanPham.api');
var apiSanPhamYTRouter = require('./routes/api/sanPhamYT.api');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// API
app.use('/hangsx',apiHangSXRouter);
app.use('/sanPham',apiSanPhamRouter);
app.use('/sanPhamYT',apiSanPhamYTRouter);
module.exports = app;

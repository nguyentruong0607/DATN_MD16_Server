const mongoose = require('mongoose');

// Mau Schema
var mauSchema = new mongoose.Schema({
    mau: String,
    soLuong:Number,
    giaTien:Number
});



// DienThoai Schema
var dienThoaiSchema = new mongoose.Schema({
    tenDienThoai: { type: String },
    camera: { type: String },
    cameraTruoc: { type: String },
    kichThuoc: { type: String },
    cPU: { type: String },
    ram: { type: String },
    sim: { type: String },
    pin: { type: String },
    heDieuHanh: { type: String },
    namSanXuat: { type: String },
    congNgheManHinh: { type: String },
    moTaThem: { type: String },
    hinhAnh: { type: String },
    doPhanGiai: { type: String },
    mauSchema:[mauSchema],
    idHangSX: { type: mongoose.Schema.Types.ObjectId, ref: 'hangsxModel' }
}, {
    collection: 'DienThoai'
});
var DienThoai = mongoose.model('DienThoai', dienThoaiSchema);



module.exports = {DienThoai,dienThoaiSchema};

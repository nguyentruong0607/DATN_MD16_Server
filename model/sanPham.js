const mongoose = require('mongoose');

// Mau Schema
var mauSchema = new mongoose.Schema({
    mau: String,
    soLuong:Number,
    giaTien:Number
});



// DienThoai Schema
var dienThoaiSchema = new mongoose.Schema({
    tenDienThoai: { type: String, required: true },
    camera: { type: String },
    cameraTruoc: { type: String, required: true },
    kichThuoc: { type: String, required: true },
    cPU: { type: String, required: true },
    ram: { type: String, required: true },
    sim: { type: String, required: true },
    pin: { type: String },
    heDieuHanh: { type: String, required: true },
    namSanXuat: { type: String, required: true },
    congNgheManHinh: { type: String },
    moTaThem: { type: String },
    hinhAnh: { type: String, required: true },
    doPhanGiai: { type: String, required: true },
    mauSchema:[mauSchema],
    idHangSX: { type: mongoose.Schema.Types.ObjectId, ref: 'hangsxModel', required: true }
}, {
    collection: 'DienThoai'
});
var DienThoai = mongoose.model('DienThoai', dienThoaiSchema);



module.exports = {DienThoai,dienThoaiSchema};

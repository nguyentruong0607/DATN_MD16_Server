const mongoose = require('mongoose');

// Mau Schema
var mauSchema = new mongoose.Schema({
    mau: String
});

// DungLuong Schema
var dungLuongSchema = new mongoose.Schema({
    dungLuong: String
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
    idHangSX: { type: mongoose.Schema.Types.ObjectId, ref: 'hangsxModel', required: true }
}, {
    collection: 'DienThoai'
});
var DienThoai = mongoose.model('DienThoai', dienThoaiSchema);

// DienThoaiCT Schema
var dienThoaiCTSchema = new mongoose.Schema({
    idDienThoai: { type: mongoose.Schema.Types.ObjectId, ref: 'DienThoai', required: true },
    Mau: { type: mauSchema },
    DungLuong: { type: dungLuongSchema },
    soLuong: String,
    giaTien: String
});
var DienThoaiCT = mongoose.model('DienThoaiCT', dienThoaiCTSchema);

module.exports = {
    Mau: mongoose.model('Mau', mauSchema),
    DungLuong: mongoose.model('DungLuong', dungLuongSchema),
    DienThoai,
    DienThoaiCT
};

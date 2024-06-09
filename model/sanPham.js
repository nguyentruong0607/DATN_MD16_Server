const { head } = require('../routes');
var db = require('./db');

var dienThoaiSchema = new db.mongoose.Schema(
    {
        idDienThoai: {
            type: db.mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        tenDienThoai: {
            type: String,
            required: true
        },
        camera: {
            type: String,
            required: false
        },
        cameraTruoc:{
            type:String,
            required:true
        },
        kichThuoc: {
             type:String,
             required:true
        },
        cPU:{
            type:String,
            required:true
        },
        ram:{
            type:String,
            required:true
        },
        sim:{
            type:String,
            required:true
        },
        pin: {
            type: String,
            required: false
        },
        heDieuHanh:{
            type:String,
            required:true,
        },
        namSanXuat:{
            type:String,
            required:true
        },
        congNgheManHinh: {
            type: String,
            required: false
        },
        moTaThem: {
            type: String,
            required: false
        },
        hinhAnh: {
            type: String,
            required:true
        },
        doPhanGiai:
        {
            type:String,
            required:true
        },
        idHangSX: {
            type: db.mongoose.Schema.Types.ObjectId,
            ref: 'HangSX',
            required: true
        }
    },
    {
        collection: 'DienThoai'
    }
);

let dienThoaiModel = db.mongoose.model("DienThoai", dienThoaiSchema);
module.exports = { dienThoaiModel };

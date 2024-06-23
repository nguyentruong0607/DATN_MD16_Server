const mongoose = require('mongoose');
var sanPhamYTSchema= new mongoose.Schema(
    {
        id_sanPham:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HangSX',
            required: true
        },
        id_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        collection:'SanPhamYeuThich'
    }
);
let sanPhamYTModel=mongoose.model("sanPhamYTModel",sanPhamYTSchema);
module.exports=sanPhamYTModel;
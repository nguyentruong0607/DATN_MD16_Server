var db=require('./db');

var sanPhamYTSchema= new db.mongoose.Schema(
    {
        id_sanPham:{
            type: db.mongoose.Schema.Types.ObjectId,
            ref: 'HangSX',
            required: true
        },
        id_user:{
            type:db.mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        collection:'SanPhamYeuThich'
    }
);
let sanPhamYTModel=db.mongoose.model("sanPhamYTModel",sanPhamYTSchema);
module.exports={sanPhamYTModel};
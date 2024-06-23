const mongoose = require('mongoose');

var accountSchema= new mongoose.Schema(
    {
        taiKhoan:{
            type:String,
            required: true
        },
        hoTen:{
            type:String,
            required:true
        },
        matKhau:{
            type:String,
            required:true
        },
        sdt:{
            type:String,
            required:true
        },
        tenQuyen:{
            type:String,
            enum:['User','Admin'],
            default:'User'
        }
    },
    {
        collection:'Account'
    }
);
let accountModel=mongoose.model("accountModel",accountSchema);
module.exports=accountModel;
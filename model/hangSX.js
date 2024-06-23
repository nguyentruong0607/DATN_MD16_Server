const mongoose = require('mongoose');
var hangsxSchema= new mongoose.Schema(
    {
        tenHang:{
            type:String,
            required: true
        }
    },
    {
        collection:'HangSX'
    }
);
let hangsxModel=mongoose.model("hangsxModel",hangsxSchema);
module.exports=hangsxModel;
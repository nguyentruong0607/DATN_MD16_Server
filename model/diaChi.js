const mongoose = require('mongoose');
var diaChiSchema= new mongoose.Schema(
    {
        tenDiaChi:{
            type:String,
            required: true
        }
    },
    {
        collection:'DiaChi'
    }
);
let diaChiModel=mongoose.model("diaChiModel",diaChiSchema);
module.exports=diaChiModel;
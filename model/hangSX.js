var db=require('./db');

var hangsxSchema= new db.mongoose.Schema(
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
let hangsxModel=db.mongoose.model("hangsxModel",hangsxSchema);
module.exports={hangsxModel};
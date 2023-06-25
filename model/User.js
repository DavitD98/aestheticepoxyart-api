const mongoose = require(`mongoose`)

const userSchema = new mongoose.Schema({
     firstname:{
        type:String,
        trim:true,
        required:true
     },
     lastname:{
        type:String,
        trim:true,
        required:true,
     },
     phone:{
      type:String,
      trim:true,
      required:true
   },
     password:{
        type:String,
        required:true
     },
     email:String,
     cart:{
        type:Array,
        default:[]
     },
     role:{
      type:Number,
      default:0
     }
},{
    timestamps:true
})

module.exports = mongoose.model(`User`,userSchema)
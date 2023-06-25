const mongoose = require(`mongoose`)

const typeSchema = new mongoose.Schema({
    name:{
        arm:{
            type:String,
            required:true,
            trim:true
        },
        eng:{
            type:String,
            required:true,
            trim:true
        }
    },
    category:{
        type:String,
        required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})

module.exports = mongoose.model(`Type`,typeSchema)
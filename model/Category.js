const mongoose = require(`mongoose`)

const categorySchema = new mongoose.Schema({
    name:{
        arm:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        },
        eng:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        }
    },
    checked:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})

module.exports = mongoose.model(`Category`,categorySchema)
const mongoose = require(`mongoose`)

const productSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        arm:{
            type:String,
            required:true,
            lowercase:true
        },
        eng:{
            type:String,
            required:true,
            lowercase:true
        }
    },
    description:{
        arm:{
            type:String,
            required:true,
            lowercase:true
        },
        eng:{
            type:String,
            required:true,
            lowercase:true
        }
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    type:String,
    images:{
        type:Object,
        required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})


module.exports = mongoose.model(`Product`,productSchema)
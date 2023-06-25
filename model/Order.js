const mongoose = require(`mongoose`)

const addressSchema = new mongoose.Schema({
    home:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    },
    zipCode:String
})

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    userFirstname:{
        type:String,
        required:true
    },
    userLastname:{
        type:String,
        required:true
    },
    userPhone:{
        type:String,
        required:true
    },
    userEmail:String,
    cart:{
        type:Array,
        required:true
    },
    totalAmount:Number,
    address:addressSchema,
    status:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    extraInfo:String
},{
    timestamps:true
})

module.exports = mongoose.model(`Order`,orderSchema)
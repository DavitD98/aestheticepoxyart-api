const mongoose = require(`mongoose`)

const statusSchema = new mongoose.Schema({
    name:{
        arm:{
            type:String,
            required:true
        },
        eng:{
            type:String,
            required:true
        }
    }
},{
    timestamps:true
})

module.exports = mongoose.model(`Status`,statusSchema)
const mongoose = require(`mongoose`)

const connectDatabase = async() => {
    try{
          await mongoose.connect(process.env.DATABASE_URI,{
            dbName:"Aesthetic",
            useUnifiedTopology:true,
            useNewUrlParser:true
          })
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {connectDatabase}
const WHITE_LIST = require("./whiteList")


const corsOptions = {
    origin:(origin,callback)=> {
        if(WHITE_LIST.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error(`Rejected by CORS`))
        }
    },
    successStatusCode:200
}

module.exports = corsOptions
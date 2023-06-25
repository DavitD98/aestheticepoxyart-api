const WHITE_LIST = require("./whiteList")

const credentials = (req,res,next) => {
    const origin = req.headers.origin 
    if(WHITE_LIST.includes(origin)){
        req.header(`Access-Control-Allow-Credentials`,true)
    }
    next()
}

module.exports = {credentials}
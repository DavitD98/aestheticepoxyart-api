const jwt = require(`jsonwebtoken`)


const verifyToken = (req,res,next) => {

    const accessToken = req.headers.authorization

    if(!accessToken) return res.status(401).json({message:{
        arm:"Անհրաժեշտ է մուտք գործել",
        eng:"Please login or register"
    }})

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error,decodedUser) => {
            if(error) return res.status(403).json({message:{
                arm:"Մուտքը վավեր չէ",
                eng:"Invalid token"
            }})

            req.user = decodedUser
            next()
        }
    )
}


module.exports = {verifyToken}

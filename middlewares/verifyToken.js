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
                arm:"Ձեր սեսսիան ավարտվել է,խնդրում ենք նորից մուտք գործել",
                eng:"Session expired,please log in again"
            }})
            req.user = decodedUser
            next()
        }
    )
}


module.exports = {verifyToken}

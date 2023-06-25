const User = require(`../model/User`)


const verifyAdmin = async(req,res,next) => {
    try{
        const user = await User.findOne({_id:req.user.id})
        if(!user) return res.status(400).json({message:{
            arm:"Օգտատեր չի գտնվել",
            eng:"No user found"
        }})
    
        if(user.role === 0){
            return res.status(401).json({message:{
                arm:"Դուք չեք կարող իրականացնել ադմինիստրատորի գործողություններ",
                eng:"Admin sources denied"
            }})
        }
        next()
    }catch(error){
        res.status(500).json({errMessage:error.message})

    }
   
}

module.exports = {verifyAdmin}
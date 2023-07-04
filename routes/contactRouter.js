const User = require(`../model/User`)
const router = require(`express`).Router()

router.get(`/contactinfor`,async(req,res) => {
    try{
        const adminContact = await User.findOne({role:1},'phone email -_id')
        
        res.json({adminContact})

    }catch(error){
        res.status(500).json({errMessage:error.message})
    }
})

module.exports = router
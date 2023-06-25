
const cloudinary = require(`cloudinary`)
const router = require(`express`).Router()
const fs = require(`fs`)
const { verifyToken } = require("../middlewares/verifyToken")
const { verifyAdmin } = require("../middlewares/verifyAdmin")


const removeFileTmp = (path) => {
    fs.unlink(path,(error) => {
        if(error) throw error
    })
}

router.post(`/upload`,verifyToken,verifyAdmin,(req,res) => {
    try{
        const file = req.files.file
        
        if(file.mimetype !== `image/jpeg` && file.mimetype !== `image/svg`){
            removeFileTmp(file.tempFilePath)
            return res.status(400).json({message:{
                arm:"Ֆայլի սխալ ֆորմատ՝ ֆայլը պետք է լինի jpeg կամ svg",
                eng:"Wrong file format,only jpeg or svg allowed"
            }})
        }
       

          cloudinary.v2.uploader.upload(file.tempFilePath,{folder:"Aesthetic epoxy art"},async(error,result) => {
            if (error) throw erro 

            res.json({
                public_id:result.public_id,
                url:result.secure_url
            })
          })

    }catch(error){
        res.status(500).json({errMessage:error.message})
    }
})



router.post(`/destroy`,verifyToken,verifyAdmin,(req,res) => {
    try{
        const {public_id} = req.body

        if(!public_id) return res.status(400).json({message:{
            arm:"Ֆայլ չի ընտրվել",
            eng:`No file selected`
        }})
    
        cloudinary.v2.uploader.destroy(public_id,async(error,result) => {
            if(error) throw error 
    
            res.json({message:{
                arm:"Ֆայլը ջնջվել է",
                eng:"File deleted"
            }})
        })
    }catch(error){
        res.status(500).json({errMessage:error.message})
    }
    const {public_id} = req.body 

    
})
module.exports = router
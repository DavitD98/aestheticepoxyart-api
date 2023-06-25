const Type = require(`../model/Type`)

const typeCtrl = {
    getTypes:async(req,res) => {
        try{
            const types = await Type.find()

            res.json(types)

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    createType:async(req,res) => {
        try{
            const {name,category} = req.body 
            
            const alreadyExists = await Type.findOne({
                $or:[
                    {'name.arm':name.arm},
                    {'name.eng':name.eng},
                ]
            })
            if(alreadyExists) return res.status(409).json({message:{
                arm:"Տիպը արդեն գոյություն ունի",
                eng:"Type already exists"
            }})

            const type = await Type.create({
                name,category
            })

            res.status(201).json({
                message:{
                arm:"Տիպը ստեղծված է",
                eng:"Type created"
               },
                type:type
        })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    updateType:async(req,res) => {
        try{
            const {name,category} = req.body
            const foundType = await Type.findOne({_id:req.params.id})
            if(!foundType) return res.status(400).json({message:{
                arm:"Տիպը չի գտնվել",
                eng:"Type not found"
            }})

            const type = await Type.findByIdAndUpdate({_id:req.params.id},{
                name,category
            },{new:true})

            res.json({
                message:{
                arm:"Տիպը փոփոխված է",
                eng:"Type edited"
                },
                type:type
        })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    deleteType:async(req,res) => {
        try{
            const foundType = await Type.findOne({_id:req.params.id})
            if(!foundType) return res.status(400).json({message:{
                arm:"Տիպը չի գտնվել",
                eng:"Type not found"
            }})
            await Type.findByIdAndDelete({_id:req.params.id})

            const typesUpdated = await Type.find()

            res.json({
                message:{
                arm:"Տիպը ջնջված է",
                eng:"Type deleted"
               },
               types:typesUpdated
             })
        }catch(error){
            res.status(500).json({errMessage:error.message})

        }
    }
}

module.exports = typeCtrl
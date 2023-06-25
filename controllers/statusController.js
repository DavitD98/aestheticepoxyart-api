const Status = require(`../model/Status`)

const statusCtrl = {
    getStatuses:async(req,res) => {
        try{
            const statuses = await Status.find()

            res.json(statuses)

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    createStatus:async(req,res) => {
        try{
            const {name} = req.body 
            
            const alreadyExists = await Status.findOne({
                $or:[
                    {'name.arm':name.arm},
                    {'name.eng':name.eng},
                ]
            })
            if(alreadyExists) return res.status(409).json({message:{
                arm:"Կարգավիճակը արդեն գոյություն ունի",
                eng:"Status already exists"
            }})

            const status = await Status.create({
                name
            })

            res.status(201).json({
                message:{
                arm:"Կարգավիճակը ստեղծված է",
                eng:"Status created"
                },
                status:status
             })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    updateStatus:async(req,res) => {
        try{
            const {name} = req.body

            const foundStatus = await Status.findOne({_id:req.params.id})
            if(!foundStatus) return res.status(400).json({message:{
                arm:"Կարգավիճակը չի գտնվել",
                eng:"Status not found"
            }})

            const updatedStatus = await Status.findByIdAndUpdate({_id:req.params.id},{
                name
            },{new:true})

            res.json({
                message:{
                arm:"Կարգավիճակը փոփոխված է",
                eng:"Status edited"
                },
                status:updatedStatus
              })
        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    deleteStatus:async(req,res) => {
        try{
            const foundStatus = await Status.findOne({_id:req.params.id})
            if(!foundStatus) return res.status(400).json({message:{
                arm:"Կարգավիճակը չի գտնվել",
                eng:"Status not found"
            }})
            await Status.findByIdAndDelete({_id:req.params.id})

            const statuses = await  Status.find()
            res.json({
                message:{
                arm:"Կարգավիճակը ջնջված է",
                eng:"Status deleted"
              },
              statuses:statuses
             })
        }catch(error){
            res.status(500).json({errMessage:error.message})

        }
    }
}

module.exports = statusCtrl
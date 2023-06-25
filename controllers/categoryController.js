
const Category = require(`../model/Category`)
const Type = require(`../model/Type`)

const categoryCtrl = {
    getCategories:async(req,res) => {
        try{
            const categories = await Category.find()

            res.json(categories)

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    createCategory:async(req,res) => {
        try{
            const {name,types} = req.body

            const alreadyExists = await Category.findOne({
                $or:[
                    {'name.arm':name.arm},
                    {'name.eng':name.eng}
                ]
            })

            if(alreadyExists) return res.status(409).json({message:{
                arm:"Կատեգորիա արդեն գոյություն ունի",
                eng:"Category already exists"
            }})

            const result = await Category.create({
                name,types
            })
            
            res.status(201).json({
                message:{
                arm:"Կատեգորիան ստեղծված է",
                eng:"Category created"
                },
                category:result
            })
        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    updateCategory:async(req,res) => {
        try{
            const {name} = req.body

            const foundCategory = await Category.findOne({_id:req.params.id})
            if(!foundCategory) return res.status(400).json({message:{
                arm:"Կատեգորիան չի գտնվել",
                eng:"Category not found"
            }})

           const category =  await Category.findByIdAndUpdate({_id:req.params.id},{
              name
            },{new:true})
            res.json({
                message:{
                arm:"Կատեգորիան փոփոխված է",
                eng:"Category edited"
                },
                category:category
             })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    deleteCategory:async(req,res) => {
        try{
            const foundCategory = await Category.findOne({_id:req.params.id})
            if(!foundCategory) return res.status(400).json({message:{
                arm:"Կատեգորիան չի գտնվել",
                eng:"Category not found"
            }})

            // Deletes all types of deleting category
            await Type.deleteMany({category:foundCategory._id})

            await Category.findOneAndDelete({_id:req.params.id})

            const updatedCategories = await Category.find()

            res.json({
                message:{
                arm:"Կատեգորիան ջնջված է",
                eng:"Category deleted"
                },
                categories:updatedCategories
        })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    }
}

module.exports = categoryCtrl
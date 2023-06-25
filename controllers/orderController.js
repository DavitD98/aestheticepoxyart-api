const Order = require(`../model/Order`)
const User = require(`../model/User`)
const Product = require(`../model/Product`)
const Status = require(`../model/Status`)
const {format} = require(`date-fns`)

const orderCtrl = {
    getOrders:async(req,res) => {
         try{
            const orders = await Order.find()
            res.json(orders)

         }catch(error){
            res.status(500).json({errMessage:error.message})
         }
    },
    createOrder:async(req,res) => {
        try{
            const {userFirstname,userLastname,userPhone,userEmail,cart,address,extrainfo} = req.body
            
            // Get user Id
            const userId = req.user.id
            
            // Calculate totalAmount of cart
            const totalAmount = cart.reduce((prevValue,product) => {
                return prevValue + (product.quantity * product.price)
            },0)

            // Creating date of order
            const date = format(new Date(),`dd-MM-yyyy HH:mm:ss`)

            // Getting inital status 
            const status = await Status.findOne({_id:"648077528cfcb7a84b060d66"})

            // Creating Order
             const result = await Order.create({
                    userId,userFirstname,userLastname,
                    userPhone,userEmail,cart,address,extrainfo,totalAmount,date,
                    status:status._id
                })
            
                // Reset cart after order
            await User.findOneAndUpdate({_id:req.user.id},{
                cart:[]
            })
            
            //  Add sold value of product by quantity of ordered 
            cart?.forEach((product) => {
                updateSold(product._id,product.quantity,product.sold)
            })
            
            res.status(201).json({
                message:{
                arm:"Պատվերը կատարված է:Շնորհակալություն մեզնից օգտվելու համար",
                eng:"Order done! Thanks for being with us"
                },
                order:result
              })
  

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    updateOrder:async(req,res) => {
        try{
            const {status} = req.body
             
            console.log(status);
            const foundOrder = await Order.findOne({_id:req.params.id})

            if(!foundOrder) return res.status(400).json({message:{
                arm:"Պատվերը չի գտնվել",
                eng:"Order not found"
            }})
 
            const updatedOrder = await Order.findByIdAndUpdate({_id:req.params.id},{
                status
            })
            res.json({
                message:{
                arm:"Կարգավիճակը թարմացված է",
                eng:"Status updated"
               },
               order:updatedOrder

        })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    }
}

const updateSold = async(productId,quantity,sold) => {
    await Product.findOneAndUpdate({_id:productId},{
            sold:sold + quantity
    })
}
module.exports = orderCtrl
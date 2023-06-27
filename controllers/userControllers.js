const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`)
const User = require(`../model/User`)
const Order = require(`../model/Order`)

const userCtrl = {
    register:async(req,res) => {
         try{
            const {firstname,lastname,email,phone,password} = req.body
 
             const phoneRegex = /^\d{9}$/ 
             const isPhone = phoneRegex.test(phone)

             if(!isPhone){
                return res.status(400).json({message:{
                    arm:"Մուտքագրված հեռախոսահամարը վավեր չէ",
                    eng:"Phone number is not valid"
                }})
             }

            const alreadyExists = await User.findOne({phone:phone})

            if(alreadyExists){
                    return res.status(409).json({message:{
                        arm:"Այս հեռախոսահամարով օգտատեր արդեն գոյություն ունի",
                        eng:"User with this phone number already exists"
                    }})
            }

            const validPassword = validatePassword(password)

            if(!validPassword){
                return res.status(400).json({
                    message:{
                        arm:"Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ",
                        eng:"Password should contain at least 6 characters"
                    }
                })
            }

            const hashedPassword = await bcrypt.hash(password,10)
            
            const newUser = await User.create({
                firstname,lastname,phone,email,password:hashedPassword
            })

            const accessToken = createAccessToken({id:newUser._id})

            res.status(201).json({
                accessToken:accessToken,
                message:{
                    arm:"Գրանցումը հաջողությամբ կատարված է",
                    eng:"Account successfully created"
                }
            })
            

         }catch(error){
            res.status(500).json({errMessage:error.message})
         }
    },
    login:async(req,res) => {
        try{
            const {phone,password} = req.body 

            const foundUser = await User.findOne({phone:phone})

            if(!foundUser) return res.status(400).json({message:{
                arm:" Սխալ հեռախոսահամար",
                eng:"Wrong phone number"
            }})

            const passwordMatch = await bcrypt.compare(password,foundUser.password)
            
            if(passwordMatch){
                
                     const accessToken = createAccessToken({id:foundUser._id})
                    
                     res.json({accessToken})
                     
            }else{
                res.status(401).json({message:{
                    arm:" Սխալ գաղտնաբառ",
                    eng:"Wrong password"
                }})
            }
            

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    logout:async(req,res) => {
        try{
          
            res.clearCookie(`refreshToken`,{path:"/user/refresh_token"})
  
            res.json({message:{
                arm:"Ելքը կատարված է",
                eng:"Logged out"
            }})

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    getUser:async(req,res) => {
        try{

            const user = await User.findOne({_id:req.user.id}).select(`-password`)
            
            if(!user) {
                return res.status(400).json({message:{
                    arm:"Օգտատեր չի գտնվել",
                    eng:"No user found"
                }})
            }
 
            res.json(user)
        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    addCart:async(req,res) => {
        try{
            const {cart} = req.body 
            
            const user = await User.findOne({_id:req.user.id})
            if(!user) return res.status(400).json({message:{
                arm:"Օգտատեր չի գտնվել",
                eng:"No user found"
            }})
            
            if(!cart) return res.status(400).json({
                arm:"Ավելացրեք ապրանք զամբյուղում",
                eng:"Add products to cart"
            })

            await User.findOneAndUpdate({_id:req.user.id},{
                cart:cart
            })
 
            if(cart.length > 1){
                res.json({message:{
                    arm:"Ապրանքները ավելացված են զամբյուղում",
                    eng:"Products added to cart"
                }})
            }else{
                res.json({message:{
                    arm:"Ապրանքը ավելացված է զամբյուղում",
                    eng:"Product added to cart"
                }})
            }
            

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    getHistory:async(req,res) => {
        try{

            const orders = await Order.find({userId:req.user.id})
            res.json(orders)
        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    editUser:async(req,res) => {
        try{
            const {firstname,lastname,phone,email} = req.body

            const foundUser = await User.findById({_id:req.params.id})

            if(!foundUser){
                return res.status(400).json({
                    message:{
                        arm:"Օգտագեր չի գտվնել",
                        eng:"No user found"
                    }
                })
            }

            // JWT verify
            if(foundUser.id !== req.user.id){
                return res.status(401).json({
                    message:{
                        arm:"Դուք չեք կարող իրականացնել տվյալ գործողությունը",
                        eng:"You are not permitted to perform this action"
                    }
                })
            }

            // Already exists
            
            const alreadyExists = await User.findOne({phone:phone})
            // if already existinguser exists,and its id is not equal to updating user id,than conflict 409
            if(alreadyExists && alreadyExists.id !== req.params.id){
                return res.status(409).json({
                    message:{
                        arm:"Այս հեռախոսահամարով օգտատեր արդեն գոյություն ունի",
                        eng:"User with this phone number already exists"
                    }
                })
            }

            // Updated
            const updatedUser = await User.findByIdAndUpdate({_id:req.params.id},{
                firstname,lastname,phone,email
            },{new:true})

            
            res.json({
                message:{
                    arm:"Օգտատիրոջ տվյալները թարմացված են",
                    eng:"Account information updated"
                },
                user:updatedUser
            })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    editPassword:async(req,res) => {
        try{
            const {oldPassword,password} = req.body 
            // Found user
            const foundUser = await User.findById({_id:req.params.id})
            if(!foundUser){
                return res.status(400).json({
                    message:{
                        arm:"Օգտագեր չի գտվնել",
                        eng:"No user found"
                    }
                })
            }
            // JWT verify
            if(foundUser.id !== req.user.id){
                return res.status(401).json({
                    message:{
                        arm:"Դուք չեք կարող իրականացնել տվյալ գործողությունը",
                        eng:"You are not permitted to perform this action"
                    }
                })
            }
            // Confirm old password 
            const passwordMatch = await bcrypt.compare(oldPassword,foundUser.password)
            if(passwordMatch){
                 // Validate password
                 const validPassword = validatePassword(password)
                 if(!validPassword){
                     return res.status(400).json({
                         message:{
                             arm:"Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ",
                             eng:"Password should contain at least 6 characters"
                         }
                     })
                 }
                 // Hash new password
                 const hashedPassword = await bcrypt.hash(password,10)

                 // Save updated user
                 const updatedUser = await User.findByIdAndUpdate({_id:req.params.id},{
                      password:hashedPassword
                 },{new:true}).select(`-password`)

                // 200 OK 
                 res.json({
                    message:{
                        arm:"Գաղտնաբառը փոփոխված է",
                        eng:"Password updated"
                    },
                    user:updatedUser
                 })

            }else{
                return res.status(401).json({
                    message:{
                        arm:"Սխալ հին գաղտնաբառ",
                        eng:"Invalid old password"
                    }
                })
            }

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    }
}


const createAccessToken = (userId) => {
    return jwt.sign(
        userId,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    )
}

const validatePassword = (password) => {
    if(password.length < 6){
        return false
    }else{
        return true
    }
}

module.exports = userCtrl
const Product = require(`../model/Product`)

class ApiFeatures{
    constructor(query,queryString){
        this.query = query 
        this.queryString = queryString
    }
    filtering(){
        const queryObject = {...this.queryString}

        const excludedFields = [`page`,`sort`,`limit`]
        excludedFields.forEach(field => delete(queryObject[field]))

        let queryStr = JSON.stringify(queryObject)

        queryStr = queryStr.replace(/\b(lt|lte|gt|gte|regex)\b/g,match => `$`+ match)
        
        this.query.find(JSON.parse(queryStr))
        return this
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(",").join(" ")
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort(`-createdAt`)
        }
        return this
    }
    pagination(){
        // Page size is the limit of products for 1 page 
        // Page is the page mentioned in query to recieve 
        // Query calculates the number of products to skip to return the page of products
        // mentioned in query.So it can calculate with the formula page-1 * pageSize,
        // where page is the number of the page you want to retrieve, pageSize is the number of documents per page.

        //For example we want 3rd page,query calculate (3-1) * pageSize(8),so it needs to skip first 18 products,show products
        // coming after 18,and limit them to 8
        const pageSize = 8
        const page = this.queryString.page 
        this.query = this.query.skip((page - 1) * pageSize).limit(pageSize)
        return this
    }
}
//api/products/?description[regex]=woman optical glasses
const productCtrl = {
    getProducts:async(req,res) => {
        try{
            // Geting only filtered (or not filtered ) products,without pagination,to get the number of all filtered products
           const features = new ApiFeatures(Product.find(),req.query).filtering().sorting()
           const products = await features.query

           // Geting filtered (or not filtered ) and paginated products
           const featuresLimited = new ApiFeatures(Product.find(),req.query).filtering().sorting().pagination()
           const productsLimited = await featuresLimited.query

            if(!productsLimited) return res.status(204).json({message:{
                arm:"Ապրանքներ չեն գտնվել",
                eng:"No products found"
            }})

            const pageLimit = 8

            res.json({
                // paginated (limited) products number
                result:productsLimited.length,
                // products paginated (limited)
                products:productsLimited,
                // status
                status:"succeed",
                // page limit
                pageLimit:pageLimit,
                //Filtered (or not filtered ) products length  without pagination,to divide with page limit
                // and get the number of available pages in client side
                totalProducts:products.length,
            })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    createProduct:async(req,res) => {
        try{
            const {productId,name,description,images,category,type,price} = req.body 
 
            const alreadyExists = await Product.findOne({productId:productId})
            if(alreadyExists) return res.status(400).json({message:{
                arm:"Նույն համարով ապրանք արդեն գոյություն ունի",
                eng:"Product with same ID already exists"
            }})

            const result =  await Product.create({
                            productId,
                            name,
                            description,
                            images,
                            category,
                            type,
                            price
                        })
            
            res.status(201).json({
                message:{
                arm:"Ապրանքը ստեղծված է",
                eng:"Product created"
                },
                product:result

            })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    updateProduct:async(req,res) => {
        try{

            const {productId,name,description,images,category,type,price} = req.body 

            const foundProduct = await Product.findOne({_id:req.params.id})
            if(!foundProduct) return res.status(400).json({message:{
                arm:"Ապրանքը չի գտնվել",
                eng:"Product not found"
            }})

            if(productId !== foundProduct.productId){
                const alreadyExists = await Product.findOne({productId})

                if(alreadyExists) return res.status(409).json({message:{
                    arm:"Նույն համարով ապրանք արդեն գոյություն ունի",
                    eng:"Product with same ID already exists"
                }})
            }

            const product = await Product.findOneAndUpdate({_id:req.params.id},{
                productId,name,description,images,category,type,price
            },{new:true})

            res.json({
                message:{
                arm:"Ապրանքը փոփոխված է",
                eng:"Product edited"
               },
               product:product
           })

        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    },
    deleteProduct:async(req,res) => {
        try{
            const foundProduct = await Product.findOne({_id:req.params.id})
            if(!foundProduct) return res.status(400).json({message:{
                arm:"Ապրանքը չի գտնվել",
                eng:"Product not found"
            }})

            await Product.findOneAndDelete({_id:req.params.id})

            const updatedProducts = await Product.find()

            res.json({
                message:{
                arm:"Ապրանքը ջնջված է",
                eng:"Product deleted",
                },
                products:updatedProducts
        })
        }catch(error){
            res.status(500).json({errMessage:error.message})
        }
    }
}

module.exports = productCtrl
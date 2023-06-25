require(`dotenv`).config()
const { connectDatabase } = require("./connectionConfig/connectDatabase")
const { default: mongoose } = require("mongoose")
const cloudinary = require(`cloudinary`)

const express = require(`express`)
const app = express()
const PORT = process.env.PORT || 5000 

const cookieParser = require(`cookie-parser`)
const fileUpload = require(`express-fileupload`)
const cors = require(`cors`)
const { credentials } = require("./config/credentials")


// Connect Database 

connectDatabase()

// Middlewares 

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))

// Cors 
app.use(cors())

// Credentials 
app.use(credentials)

//Cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
})

// Routes 
app.use(`/user`,require(`./routes/userRouter`))
app.use(`/api`,require(`./routes/productRouter`))
app.use(`/api`,require(`./routes/cloudinaryRouter`))
app.use(`/api`,require(`./routes/categoryRouter`))
app.use(`/api`,require(`./routes/typeRouter`))

app.use(`/api`,require(`./routes/statusRouter`))
app.use(`/api`,require(`./routes/orderRouter`))


mongoose.connection.once(`open`,() => {
    console.log(`Connected to database`);
})
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})
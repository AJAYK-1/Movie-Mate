const express =require('express')
const cors=require('cors')
const app=express()
const path=require('path')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//databaseconnection

const dbConnect=require('./models/dbConnect')
dbConnect()

// // admin router
const adminRouter=require('./router/adminRouter')
app.use("/admin",adminRouter)
// // user router
const userRouter=require('./router/userRouter')
app.use("/user",userRouter)
// theater router
const theaterRouter=require('./router/theaterRouter')
app.use("/theater",theaterRouter)



app.listen(process.env.PORT,()=>{console.log("Server running at",process.env.PORT)})

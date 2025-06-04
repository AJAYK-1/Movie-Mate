const mongoose=require('mongoose')


const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.Mongo_url)
        console.log("Database connected successfully")
    }
    catch(err){
        console.log("Database Connection failed",err)
    }
}

module.exports=dbConnect
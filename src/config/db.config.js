import mongoose from "mongoose";


export const connectToDb=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("DB Connected successfully")

    }catch(err){
        console.log(err);
    }
}
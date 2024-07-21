import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, maxLength: [25, "Name can't be gretaer than 25 characters"] },
    email: {
        type: String, unique: true, required: true,
        match: [/.+\@.+\../, "Pleae enter a valid email"]
    },
    password: {
        type: String,
       
    },
    habits:[
        {type:mongoose.Types.ObjectId, ref:'habit'}
    ],
    imageUrl:{type:String,default:"/src/assets/placeholder.png"}

},{timestamps:true})

const userModel=mongoose.model('users',userSchema);
export default userModel;

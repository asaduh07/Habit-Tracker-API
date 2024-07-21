import ApplicationError from '../../errorhandler/applicationError.js';
import userModel from './user.Schema.js';

export default class UserRepository {

    async addUser(userData) {
        try {
            const newUser = new userModel({
                name: userData.name,
                email: userData.email,
                password: userData.password

            });
            await newUser.save();

        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong with database", 500)

        }
    }

    

    async findByEmail(email) {
        try{
            const user= await userModel.findOne({email});
            if(user){
                return user;              
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    async updateDetails(imageUrl,newData){
        try{
            const { userId, name, email } = newData;

        // Create an update object dynamically
        let updateObject = {};
        if (imageUrl) updateObject.imageUrl = imageUrl;
        if (name) updateObject.name = name;
        if (email) updateObject.email = email;

        // Ensure there is something to update
        if (Object.keys(updateObject).length === 0) {
            throw new ApplicationError("No valid fields to update", 400);
        }

        const user = await userModel.findByIdAndUpdate(userId, updateObject, { new: true });

        if (user) {
            return user;
        } else {
            throw new ApplicationError("User not found", 404);
        }

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    async fetchUser(userId){
        try {
            const user=await userModel.findById(userId).select('name email imageUrl habits');
            if(user){
                return {success:true, res:user}
            }else{
                return {success:false, res:"User not found"}
            }
        } catch (error) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

}
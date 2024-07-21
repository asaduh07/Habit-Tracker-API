import UserRepository from "./user.repository.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        try {
            const { password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            req.body = { ...req.body, password: hashedPassword }
            await this.userRepository.addUser(req.body);
            res.status(201).json({ message: "SignUp successful" });
        } catch (err) {
            next(err);
        }

    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            //1.find user by email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res.status(400).json({success:false,res:"User not found"});
            } else {
                //2.compare password with hashed password
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    //3. create token
                    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
                        expiresIn: '24h',
                    })
                    //4.send token
                    return res.status(200).send(token);

                } else {
                    return res.status(400).json({success:false,res:"Incorrect credentials"});

                }
            }

        } catch (err) {
            next(err)
        }


    }

    async uploadProfileImage(req, res, next) {
        try {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 
            const userId=req.userId;
            const result = await this.userRepository.updateDetails(imageUrl, {userId,...req.body})
            if (result) {
                return res.status(200).send(result);
            }
        } catch (error) {
            next(error)
        }
    }

    async fetchUserById(req,res,next){
        try {
            const userId= req.userId;
            const result=await this.userRepository.fetchUser(userId);
            if(result.success){
                return res.status(200).json({success:true,res:result.res})
            }else{
                return res.status(404).json({success:false,res:result.res});
            }
            
        } catch (error) {
            next(error)
        }

    }

}
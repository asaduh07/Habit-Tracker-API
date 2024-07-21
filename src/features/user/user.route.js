import express from 'express';
import UserController from './user.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
const userRouter=express.Router();
const userController=new UserController();
userRouter.route('/signup').post((req,res,next)=>{
    userController.signUp(req,res,next);

});
userRouter.route('/signin').post((req,res,next)=>{
    userController.signIn(req,res,next);

});
userRouter.route('/').put(jwtAuth,upload.single('imageUrl'),(req,res,next)=>{
    userController.uploadProfileImage(req,res,next);

});
userRouter.route('/me').get(jwtAuth,(req,res,next)=>{
    userController.fetchUserById(req,res,next);

});

export default userRouter;
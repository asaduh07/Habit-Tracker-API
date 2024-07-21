import express from 'express';
import HabitController from './habit.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
const habitRouter=express.Router();
const habitController = new HabitController();

habitRouter.route('/add').post(jwtAuth,(req,res,next)=>{
    habitController.addHabit(req,res,next)
})
habitRouter.route('/').get(jwtAuth,(req,res,next)=>{
    habitController.fetchHabit(req,res,next)
})
habitRouter.route('/toggleFav/:id').put((req,res,next)=>{
    habitController.updateFav(req,res,next)
})
habitRouter.route('/:id').put((req,res,next)=>{
    habitController.changeHabitStatus(req,res,next)
})

habitRouter.route('/:id').get((req,res,next)=>{
    habitController.fetchHabitById(req,res,next)
})
habitRouter.route('/:id').delete((req,res,next)=>{
    habitController.deleteHabit(req,res,next)
})
habitRouter.route('/detail/:id').put((req,res,next)=>{
    habitController.updateHabit(req,res,next)
})


export default habitRouter;
import HabitRepository from "./habit.repository.js";


export default class HabitController {
    constructor() {
        this.habitRepository = new HabitRepository();
    }

    async addHabit(req, res, next) {
        try {
            const result = await this.habitRepository.postHabit(req.body,req.userId);
            if (result) {
                res.status(201).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }

        } catch (error) {
            next(error);
        }
    }

    async fetchHabit(req, res, next) {
        try {
            const result = await this.habitRepository.getUserHabit(req.userId);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }

        } catch (error) {
            next(error)
        }
    }

    async updateFav(req, res, next) {
        try {
            const habitId = req.params.id;
            const result = await this.habitRepository.toggleFav(habitId);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }

        } catch (error) {
            next(error)

        }
    }

    async changeHabitStatus(req,res,next){
        try {
            const habitId = req.params.id;
            const result=await this.habitRepository.toggleHabitStatus(habitId,req.body);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }
            
        } catch (error) {
            next(error)            
        }
    }

    

    async fetchHabitById(req,res,next){
        try {
            const habitId = req.params.id;
            const result=await this.habitRepository.gethabitById(habitId);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }
            
        } catch (error) {
            next(error)
        }
    }
    async deleteHabit(req,res,next){
        try {
            const habitId = req.params.id;
            const result=await this.habitRepository.deleteHabitById(habitId);
            if (result.success) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }
            
        } catch (error) {
            next(error);
        }
    }
    async updateHabit(req,res,next){
        try {
            const habitId = req.params.id;
            const result=await this.habitRepository.updatedHabitById(habitId,req.body);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }
            
        } catch (error) {
            next(error);
        }
    }


}
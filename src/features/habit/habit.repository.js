import mongoose from "mongoose";
import ApplicationError from "../../errorhandler/applicationError.js";
import { HabitModel } from "./habit.schema.js";
import { format, getDay, parse, } from 'date-fns';
import userModel from "../user/user.Schema.js";
export default class HabitRepository {

    static calculateStreaks(statuses) {
        let currentStreak = 0;
        let bestStreak = 0;
        let totalDays = 0;

        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].status === 'done') {
                currentStreak++;
                totalDays++;
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                }
            } else {
                currentStreak = 0; // Reset current streak when an undone status is found
            }
        }

        return { currentStreak, bestStreak, totalDays };
    }

    static updateStatuses = (storedStatuses) => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const todayDateString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const latestStoredDate = storedStatuses.length ? storedStatuses[storedStatuses.length - 1].date : null;
        if (!latestStoredDate) {
            // If no statuses exist, initialize with today's date
            return [{
                date: todayDateString,
                day: dayNames[today.getDay()],
                status: 'none'
            }];
        }

        const latestDate = new Date(latestStoredDate);

        // If today's date is already the latest stored date, no need to update
        if (todayDateString === latestStoredDate) {
            return storedStatuses;
        }

        const updatedStatuses = [...storedStatuses];

        // Add missing days between the latest stored date and today
        let currentDate = new Date(latestDate);
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day

        while (currentDate <= today) {
            const dateString = currentDate.toISOString().split('T')[0];
            const dayString = dayNames[currentDate.getDay()];

            updatedStatuses.push({ date: dateString, day: dayString, status: 'none' });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Remove the oldest date if there are more than 7 statuses
        while (updatedStatuses.length > 7) {
            updatedStatuses.shift();
        }

        return updatedStatuses;
    }



    async postHabit(habitData, userId) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                return { success: false, res: "User not found" };
            }
    
            // Current date
            const now = new Date();
            const date = format(now, 'yyyy-MM-dd');
    
            // Day of the week
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const day = getDay(now);
            const dayString = dayNames[day];
    
            // Deconstructing the request body
            const { title, schedule } = habitData;
    
            // Parse and format schedule time
            const scheduleTime = parse(schedule, 'HH:mm', new Date());
            const formattedSchedule = format(scheduleTime, 'hh:mm a');
    
            // Creating new habit
            const newHabit = new HabitModel({
                title: title,
                scheduledTime: formattedSchedule,
                statuses: [{
                    date: date,
                    day: dayString,
                    status: 'none'
                }],
                user: new mongoose.Types.ObjectId(userId),
            });
    
            const savedHabit = await newHabit.save();
            if (!savedHabit) {
                return { success: false, res: "Habit not saved" };
            }
    
            // Add habit to user's habits array and save user
            user.habits.unshift(savedHabit._id);
            await user.save();
    
            return { success: true, res: "Habit saved successfully" };
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }
    

    async getUserHabit(userId) {
        try {
            const habits = await HabitModel.find({user:new mongoose.Types.ObjectId(userId)});
            if(!habits.length){
                return{ success: false, res: "No Habits" }
            }
            const batchUpdates = habits.map(async (habit) => {
                const updatedStatuses = HabitRepository.updateStatuses(habit.statuses);
                if (JSON.stringify(updatedStatuses) !== JSON.stringify(habit.statuses)) {
                    const { currentStreak, bestStreak, totalDays } = HabitRepository.calculateStreaks(updatedStatuses);
                    const updatedHabit = await HabitModel.findByIdAndUpdate(habit._id, { statuses: updatedStatuses, currentStreak, bestStreak, totalDays }, { new: true });
                    return updatedHabit;
                }
                return habit;
            });

            const updatedHabits = await Promise.all(batchUpdates);

            return { success: true, res: updatedHabits };

        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }


    async toggleFav(habitId) {
        try {
            const habitExist = await HabitModel.findById(habitId);
            if (habitExist) {
                habitExist.fav = !habitExist.fav;
                const savedHabit = await habitExist.save();
                return { success: true, res: savedHabit };
            }
            else {
                return { success: false, res: "habit not found" }
            }

        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }

    async toggleHabitStatus(habitId, habitData) {
        try {
            const { dateId } = habitData;
            const habitExist = await HabitModel.findById(habitId);
            if (habitExist) {

                const statusExist = habitExist.statuses.find((date) => date._id.equals(dateId));
                if (statusExist) {
                    statusExist.status = (statusExist.status === 'none' || statusExist.status === 'notDone') ? 'done' : 'notDone';

                    // Save the habit and then calculate streaks
                    await habitExist.save();
                    const updatedStreaks = HabitRepository.calculateStreaks(habitExist.statuses);

                    // Update habit with calculated streaks
                    habitExist.currentStreak = updatedStreaks.currentStreak;
                    habitExist.bestStreak = updatedStreaks.bestStreak;
                    habitExist.totalDays = updatedStreaks.totalDays;
                    await habitExist.save();

                    return { success: true, res: habitExist };
                } else {
                    return { success: false, res: "Date not found" };
                }

            } else {
                return { success: false, res: "habit not found" };
            }


        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }

    

    async gethabitById(habitId){
        try{
            const habit=await HabitModel.findById(habitId);
            if(habit){
                return { success: true, res: habit };
            }else{
                return { success: false, res: "habit doesn't exist" };
            }

        }catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }
    async deleteHabitById(habitId){
        try {
            const deletedHabit=await HabitModel.findByIdAndDelete(habitId);
            if(deletedHabit){
                return { success: true, res: "habit deleted successfully" };
            }else{
                return { success: false, res: "habit doesn't exist" };
            }
            
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }

    async updatedHabitById(habitId,newData){
        try {
            const{title,schedule}=newData;
            const scheduledTime = parse(schedule, 'HH:mm', new Date());
            const formattedSchedule = format(scheduledTime, 'hh:mm a');
            const updatedHabit=await HabitModel.findByIdAndUpdate(habitId,{title:title,scheduledTime:formattedSchedule},{new:true});
            if(updatedHabit){
                return { success: true, res: updatedHabit };
            }else{
                return { success: false, res: "habit doesn't exist" };
            }
            
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }

    }
}
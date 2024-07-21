
import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema({
    title: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    statuses: [{
        date: { type: Date, required: true },
        day:{ type: String, required: true },
        status: { type: String, enum: ['none', 'done', 'notDone'], required: true }
    }],
    fav: { type: Boolean, default: false },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 },
    user:{type:mongoose.Types.ObjectId,ref:'users', required: true}
},{timestamps:true});

export const HabitModel= mongoose.model('Habit',habitSchema);
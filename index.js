import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './src/config/env.config.js';
import userRouter from './src/features/user/user.route.js';
import habitRouter from './src/features/habit/habit.route.js';
import ApplicationError from './src/errorhandler/applicationError.js';
import { connectToDb } from './src/config/db.config.js';

const app= express();
app.use(cors());
app.use(bodyParser.json());
app.use('/src/assets',express.static('src/assets'));
app.use('/uploads', express.static('uploads'));

app.get('/',(req,res)=>{
    res.status(200).send("Welcome to habit tracker");
})

app.use('/api/user',userRouter);
app.use('/api/habit',habitRouter);

//middleware to handle 404 error
app.use((req, res) => {
    res.status(404).send("API not found")
})

//error handler middleware
app.use((err, req, res, next) => {
    console.log(err);
    
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }
    //server errors.
     res.status(500).send("Something went wrong, try again later");
});


app.listen(process.env.PORT,()=>{
    console.log("Server is running at",process.env.PORT);
    connectToDb();
})
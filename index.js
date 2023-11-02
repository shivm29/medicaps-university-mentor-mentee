import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
import docsRoutes from "./routes/docsRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import teacherRoutes from "./routes/teacherRoutes.js"
import meetingRoutes from "./routes/meetingRoutes.js"

// configure env : 
dotenv.config();

// database config
// connects to MongoDB database using Mongoose and returns the database connection object
connectDB();

// creating rest object to create APIs
const app = express()


// middlewares
// parses the JSON data and makes it available as JavaScript objects 
app.use(cors());
app.use(express.json())
// For incomming HTTP requests
app.use(morgan('dev'))


// routes
// routes for authentication
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/docs', docsRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/meetings', meetingRoutes);


// basic route for homepage | REST api
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the backend</h1>")
})


const PORT = process.env.PORT || 8080;

// run / listen app 
app.listen(PORT, () => {
    console.log(`Server`);
})
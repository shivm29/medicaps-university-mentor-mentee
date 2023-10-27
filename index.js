import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import docsRoutes from "./routes/docsRoutes.js"
import multer from "multer";
// configure env : 
dotenv.config();

// database config
// connects to MongoDB database using Mongoose and returns the database connection object
connectDB();

// creating rest object to create APIs
const app = express()



// middlewares
// parses the JSON data and makes it available as JavaScript objects 
app.use(express.json())
// For incomming HTTP requests
app.use(morgan('dev'))


// routes
// routes for authentication
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/docs', docsRoutes);


// basic route for homepage | REST api
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the backend</h1>")
})


const PORT = process.env.PORT || 8080;

// run / listen app 
app.listen(PORT, () => {
    console.log(`Server`);
})
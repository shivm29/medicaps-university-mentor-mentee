// in this file schemas are designed using mongoose
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    enrollment_no: {
        type: String,
    },
    scholar_no: {
        type: Number,
    },
    role: {
        type: String,
        default: "student",
    },
    mobile: {
        type: Number,
        required: true
    },
    program: {
        type: String,
    },
    faculty: {
        type: String,
    },
    branch: {
        type: String,
    },
    class_name: {
        type: String,
    },
    assigned_teacher: {
        type: mongoose.Schema.Types.ObjectId,
        default: ""
    }
}, { timestamps: true })

export default mongoose.model('users', userSchema)


/*
    "name" : "shivam puri goswami",
    "email" : "shivam@gmail.com",
    "password" : "123",
    "enrollment_no" : "EN21IT301104",
    "scholar_no" : 2102307,
    "mobile": 9301133682,
    "program" : "BTECH",
    "branch" : "IT",
    "class_name" : "IT-B",
    "faculty" : "Engineering"

*/
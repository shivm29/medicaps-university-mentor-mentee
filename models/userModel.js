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
    role: {
        type: String,
        default: "student",
    },
    teacherId: {
        type: String,
    }
}, { timestamps: true })

export default mongoose.model('users', userSchema)
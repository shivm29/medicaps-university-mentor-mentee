// in this file schemas are designed using mongoose
import mongoose from "mongoose"

const meetingSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    mentor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    attendance: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('meetings', meetingSchema)
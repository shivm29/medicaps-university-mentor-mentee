// in this file schemas are designed using mongoose
import mongoose from "mongoose"

const docsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    document: {
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        default: "pending",
    }
}, { timestamps: true })

export default mongoose.model('documents', docsSchema)
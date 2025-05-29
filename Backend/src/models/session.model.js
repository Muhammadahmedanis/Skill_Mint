import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    role: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    topicToFocus: {
        type: String,
        required: true,
    },
    description: String,
    question: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }],

}, { timestamps: true})

export const session = mongoose.model("Session", sessionSchema);
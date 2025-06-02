import mongoose from "mongoose";

const quizQSchema = new mongoose.Schema({
    queston: {
        type: String,
        reuired: true,
    },
    options:{
        type: [String],
        validate: [opt => opt.length >= 2, 'At least 2 options required'],
        reuired: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
})

const quizScehema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    topicName: {
        type: String,
        required: true
    },
    quizQ: {
        type: [quizQSchema],
        required: true,
    },
    Score: {
        type: Number,
        default: 0.
    },
    suggestion:[
        {
          type: String

        }
    ]

}, { timestamps: true});

export const Quiz = mongoose.model("Quiz", quizScehema);
import mongoose from "mongoose";

const quizQSchema = new mongoose.Schema({
    question: {
        type: String,
        reuired: true,
    },
    options:{
        type: [String],
        validate: {
            validator: (opt) => opt.length >= 2,
            message: 'At least 2 options are required.',
        },
        reuired: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
})

const quizScehema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
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
        default: 0,
    },
    suggestion:[
        {
          type: String
        }
    ]

}, { timestamps: true});

export const Quiz = mongoose.model("Quiz", quizScehema);
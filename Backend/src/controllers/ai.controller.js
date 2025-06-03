import { GoogleGenAI } from '@google/genai';
import { conceptExplainPrompt, questionAnswerPrompt, quizQPrompt, suggestionPrompt } from "../utils/prompts.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
import { Quiz } from '../models/quiz.model.js';
const { MISSING_FIELDS, UPDATE_UNSUCCESS_MESSAGES } = responseMessages

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

// @desc   Generate interview question and answer using Gemini
// @route  POST  /api/v1/generate-questions
// @access Private

export const generateInterviewQuestion = asyncHandler(async (req, res) => {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body
    if(!role || !experience || !topicsToFocus || !numberOfQuestions){
        throw new ApiError(StatusCodes.BAD_REQUEST, MISSING_FIELDS);
    };

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    const response = await ai?.models?.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
    })

    // Clean it: remove json ``` from start and end
    let rawText = response?.text;
    const cleanedText = rawText
    .replace(/^```json\S*/, "") // remove starting ``` json
    .replace(/```$/, "") // remove ending ```
    .trim();

    const data = JSON.parse(cleanedText);
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', data));
});




// @desc   Generate explains a interview question
// @route  POST  /api/v1/generate-explanation
// @access Private

export const generateConceptExplanation = asyncHandler(async (req, res) => {
    const { question } = req.body;
    if(!question){
        throw new ApiError(StatusCodes.BAD_REQUEST, MISSING_FIELDS);
    };

    const prompt = conceptExplainPrompt(question);
    const response = await ai?.models?.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
    })
    
    // Clean it: remove json ``` from start and end
    let rawText = response?.text;
    const cleanedText = rawText
    .replace(/^```json\S*/, "") // remove starting ```json
    .replace(/```$/, "")        // remove ending ```
    .trim();

    const data = JSON.parse(cleanedText);
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', data));
})


// @desc   Generate quiz questions
// @route  POST  /api/v1/generate-quiz
// @access Private

export const genrateQuiz = asyncHandler(async (req, res) => {
    const { topicName } = req.body;
    const userId = req?.user?._id;
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    };

    const prompt = quizQPrompt(topicName);
    const response = await ai?.models?.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
    })

    let rawText = response?.text;
    const cleanedText = rawText
    .replace(/^```json\S*/, "") // remove starting ``` json
    .replace(/```$/, "") // remove ending ```
    .trim();

    const quizDoc = await Quiz.create({
        topicName,
        userId,
        quizQ: JSON.parse(cleanedText),
    }) 
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', quizDoc));
})




// @desc   Generate suggestion based on result
// @route  POST  /api/v1/generate-quiz
// @access Private

export const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId, selectedAnswers } = req.body;
    const quiz =  await Quiz.findById(quizId);
    if(!quiz) return res.status(StatusCodes.NOT_FOUND).send(new ApiResponse(StatusCodes.NOT_FOUND, UPDATE_UNSUCCESS_MESSAGES));

    let score = 0;
    const wrongQuestion = [];
    quiz?.quizQ?.forEach((q, ind) => {
        if(q.correctAnswer === selectedAnswers[ind]){
            score++;
        }else {
            wrongQuestion.push({
                question: q?.question,
                selected: selectedAnswers[ind],
                correct: q?.correctAnswer,
            })
        }
    })

    const prompt = suggestionPrompt(quiz?.topicName, wrongQuestion);
    const response = await ai?.models?.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
    })

    let rawText = response?.text;
    const suggestion = rawText
    .replace(/^```json\S*/, "") // remove starting ``` json
    .replace(/```$/, "") // remove ending ```
    .trim();

    quiz.Score = score;
    quiz.suggestion = suggestion;
    await quiz.save();

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, 'Quiz submission successful'));
})
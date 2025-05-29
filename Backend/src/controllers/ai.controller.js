import { GoogleGenAI } from '@google/genai';
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
const { MISSING_FIELDS } = responseMessages

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
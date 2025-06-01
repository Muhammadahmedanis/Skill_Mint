import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
const { MISSING_FIELDS, UNAUTHORIZED_REQUEST, GET_SUCCESS_MESSAGES, EMPTY_URL_PARAMS, UPDATE_UNSUCCESS_MESSAGES, MISSING_FIELD_EMAIL, INVALID_DATA, NO_DATA_FOUND, IMAGE_SUCCESS, IMAGE_ERROR , UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED} = responseMessages


// @desc   Add additional questions to an existing session
// @route  POST  /api/v1/question/add
// @access Private

export const addQuestionsToSession = asyncHandler(async (req, res) => {
    const { sessionId, questions } = req.body;
    if(!sessionId || !questions || !Array.isArray(questions)){
        throw new ApiError(StatusCodes.BAD_REQUEST, INVALID_DATA);
    };

    const session = await Session.findById(sessionId);
    if(!session){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_DATA_FOUND);
    };

    const createQuestions = await Question.insertMany(
        questions?.map((q) => ({
            session: sessionId,
            question: q?.question,
            answer: q?.answer,
        }))        
    );

    session.questions.push(...createQuestions.map((q) => q?._id));
    await session.save();

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', createQuestions));
});


// @desc   Pin or unpin a question
// @route  PUT  /api/v1/question/:id/pin
// @access Private

export const togglePinQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req?.params.id);
    if(!question){
        throw new ApiError(StatusCodes.BAD_REQUEST, NO_DATA_FOUND);
    };

    question.isPinned = !question?.isPinned;
    await question.save();

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', question));
})


// @desc   update a note for a question
// @route  POST  /api/v1/question/:id/note
// @access Private

export const updateQuestionNote = asyncHandler(async (req, res) => {
    if(!req.params.id){
        throw new ApiError(StatusCodes.BAD_REQUEST, EMPTY_URL_PARAMS);
    };

    const { note } = req.body;
    const question = await Question.findById(req.params.id);
    if(!question){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_DATA_FOUND);
    };

    question.note = note || "";
    
    await question.save();

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', question)); 
})
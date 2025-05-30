import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
const { MISSING_FIELDS, UNAUTHORIZED_REQUEST, GET_SUCCESS_MESSAGES, DELETED_SUCCESS_MESSAGES, UPDATE_UNSUCCESS_MESSAGES, MISSING_FIELD_EMAIL, INVALID_DATA, NO_DATA_FOUND, IMAGE_SUCCESS, IMAGE_ERROR , UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED} = responseMessages


// @desc   Create a new session and linked questions
// @route  POST  /api/v1/session/create
// @access Private

export const createSession = asyncHandler(async (req, res) => {
    const userId = req?.user?._id
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    };

    const { role, experience, topicsToFocus, description, questions } = req?.body;
    if(!role || !experience || !description ||!topicsToFocus){
        throw new ApiError(StatusCodes.BAD_REQUEST, MISSING_FIELDS);
    };

    const session = await Session.create({
        user: userId,
        role,
        experience,
        topicsToFocus,
        description,
    })

    const questionDocs = await Promise.all(
        questions?.map(async (q) => {
            const question = await Question.create({
                session: session?._id,
                question: q?.question,
                answer: q?.answer,
            });
            return question?._id;
        })
    );

    session.questions = questionDocs;
    await session.save();
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', session));
});



// @desc   Get all session for logged-in user
// @route  GET  /api/v1/session/my-sessions
// @access Private

export const getMySessions = asyncHandler(async (req, res) => {
    const userId = req?.user?._id
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    };

    const sessions = await Session.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("questions");
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', sessions));
});



// @desc   Get a session by ID with populated questions
// @route  GET  /api/v1/session/:id
// @access  Private

export const getSessionId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new ApiError(StatusCodes.BAD_REQUEST, UPDATE_UNSUCCESS_MESSAGES);
    }; 

    const session = await Session.findById(req?.params?.id)
    .populate({
        path: "questions",
        options: { sort: { isPinned: -1, created: 1 } },
    })
    .exec();

    if(!session){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_DATA_FOUND);
    };

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', session));
});


// @desc    delete a session and its question
// @route   DELETE  /api/v1/session/:id
// @access  Private 

export const deleteSession = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id){
        throw new ApiError(StatusCodes.BAD_REQUEST, UPDATE_UNSUCCESS_MESSAGES);
    }; 

    const session = await Session.findById(req.params.id);
    if(!session){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_DATA_FOUND);
    };

    if(session?.user.toString() !== req?.user.id){
        throw new ApiError(StatusCodes.BAD_REQUEST, UNAUTHORIZED_REQUEST);
    };

    await Question.deleteMany({ session: session?._id});
    await session?.deleteOne();

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK,DELETED_SUCCESS_MESSAGES));

});
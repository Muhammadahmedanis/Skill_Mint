import { Quiz } from "../models/quiz.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { responseMessages } from "../constant/responseMessages.js";
// const { MISSING_FIELDS, USER_EXISTS, UN_AUTHORIZED, SUCCESS_REGISTRATION, NO_USER, UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED} = responseMessages



export const getQProgress = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    if(!userId){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    };
    const quiz = await Quiz.find({ userId: userId.toString() }).select("topicName Score suggestion quizQ userId createdAt").lean();
    const formatted = quiz?.map(quiz => ({
        topicName: quiz.topicName,
        Score: quiz.Score,
        suggestion: quiz.suggestion,
        createdAt: quiz.createdAt,
        questionLength: quiz.quizQ?.length || 0,
        userId: quiz?.userId,
    }))     
    
    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', formatted));
})
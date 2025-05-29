import { StatusCodes } from "http-status-codes";

export const asyncHandler = (requestHandler) => async(req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
    }
}
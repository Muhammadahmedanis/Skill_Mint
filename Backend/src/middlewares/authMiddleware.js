import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { responseMessages } from "../constant/responseMessages.js";
import { User } from "../models/user.model.js";
const { UNAUTHORIZED_REQUEST, INVALID_TOKEN, ADMIN_ACCESS} = responseMessages

export const verifyJwt = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);
    
    if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, INVALID_TOKEN);
    }

    req.user = user;
    next();
});


export const verifyAdmin = asyncHandler(async (req, res, next) => {
    verifyJwt(req, res, next, () => {
        if (!req.user?.role === "admin") {
            throw new ApiError(StatusCodes.UNAUTHORIZED, ADMIN_ACCESS);
        }
        next();
    })
})
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendWelcomeEmail } from '../utils/sendEmail.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { responseMessages } from "../constant/responseMessages.js";
const { MISSING_FIELDS, USER_EXISTS, UN_AUTHORIZED, SUCCESS_REGISTRATION, NO_USER, SUCCESS_LOGIN, INVALID_OTP, OTP_EXPIRED, EMAIL_VERIFY, SUCCESS_LOGOUT, MISSING_FIELD_EMAIL_PASSWORD, UNAUTHORIZED_REQUEST, GET_SUCCESS_MESSAGES, RESET_LINK_SUCCESS, PASSWORD_CHANGE, NOT_VERIFY, PASSWORD_AND_CONFIRM_NO_MATCH, UPDATE_UNSUCCESS_MESSAGES, MISSING_FIELD_EMAIL, RESET_OTP_SECCESS, INVALID_TOKEN, TOKEN_EXPIRED, SUCCESS_TOKEN, INVALID_DATA, NO_DATA_FOUND, IMAGE_SUCCESS, IMAGE_ERROR , UPDATE_SUCCESS_MESSAGES, UNAUTHORIZED} = responseMessages

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById( userId );
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}


// @desc    SIGNUP
// @route   POST /api/v1/auth/signup
// @access  Public

export const signup = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;
    if(!userName || !email || !password || typeof userName !== "string" || typeof email != "string" || typeof password != "string"){
        throw new ApiError(StatusCodes.BAD_REQUEST, MISSING_FIELDS);
    }; 

    const isUserExist = await User.findOne({ $or: [{ userName }, { email }] }).lean();
    if(isUserExist){
        throw new ApiError(StatusCodes.CONFLICT, USER_EXISTS); 
    };

    const imgFile = req?.file;
    if(!imgFile){
        throw new ApiError(StatusCodes.BAD_REQUEST, IMAGE_ERROR);
    };

    const uploadedImage = await uploadOnCloudinary(imgFile?.path);
    if(!uploadedImage){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Image upload failed!");
    };


    const newUser = await User.create({
        userName,
        email,
        password,
        profilePic: uploadedImage?.secure_url,
    });

    const emailSent = await sendWelcomeEmail(newUser?.email, newUser?.userName);
    if (!emailSent) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, EMAIL_ERROR);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser?._id);
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none', 
    };

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res
        .status(StatusCodes.CREATED)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .send(new ApiResponse(StatusCodes.OK, SUCCESS_REGISTRATION, userResponse, accessToken, refreshToken ))
});



// @desc    SIGNIN
// @route   POST /api/v1/auth/signin
// @access  Public

export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(StatusCodes.BAD_REQUEST, MISSING_FIELD_EMAIL_PASSWORD);
    }
    
    const user = await User.findOne({ email });
    if(!user){
        throw new ApiError(StatusCodes.NOT_FOUND, NO_USER);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(StatusCodes.BAD_REQUEST, INVALID_DATA)
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInusers = await  User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }
    return res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(new ApiResponse(StatusCodes.OK, SUCCESS_LOGIN, loggedInusers))
});



// @desc    LOGOUT
// @route   POST api/v1/auth/logout
// @access  Public

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req?.user._id, {
        $unset: { refreshToken: 1 }
    }, { new: true });

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
    .status(StatusCodes.OK)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send(new ApiResponse(StatusCodes.OK,  SUCCESS_LOGOUT, {}));
})


// @desc    Get User profile
// @route   POST api/v1/auth/getProfile
// @access  Private (Requires JWT)
export const getUserProfile = asyncHandler(async (req, res) => {    
    const user = req?.user;
    if(!user){
        throw new ApiError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED_REQUEST);
    };

    const isUser = await User.findOne({_id: user?._id}).select('-password -refreshToken').lean();
    if(!isUser){
        throw new ApiError(StatusCodes.BAD_REQUEST, NO_DATA_FOUND);
    };

    return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, '', isUser));
});



export const refreshAccessToken = async (req, res) => {
    try {
        const getRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if (!getRefreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).send(new ApiResponse(StatusCodes.BAD_REQUEST, UNAUTHORIZED));
        }

        const decoded = jwt.verify(getRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded?._id);
        if (!user || user.refreshToken !== getRefreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return true;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.clearCookie("refreshToken");
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token expired. Please log in again." });
            return false;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
        return false;
    }
};


import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken ||  
        req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError('Not authorized to access this route Please login', 401);
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            '-password -refreshToken'
        );
        if (!user) {
            throw new ApiError('Invalid Access Token User not found', 404);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError('Not authorized to access this route in catch Please login', 401, error?.message);
    }
})
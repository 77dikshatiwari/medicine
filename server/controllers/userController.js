import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "Please provide username, email and password");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password should be at least 6 characters long");
    }
    if(email.includes("@")===false){
        throw new ApiError(400, "Please provide valid email");
    }
    const existingUser = await User.findOne({$or: { email }});
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }
    const newUser = await User.create({
      username,
      email,
      password,
    })
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken");
        if (!createdUser) {
            throw new ApiError(404, "Failed to reguster user");
        }
        return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        )
  } catch (error) {
    throw new ApiError(500, error.message || "There is some error in registring the user");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
try {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }
    const user = await User.findOne({$or: { email }});
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user?._id
    );
    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Failed to login user");
    }
    const loggedInUser = await User.findById(user?._id).select(
        "-password -refreshToken"
    );
    if (!loggedInUser) {
        throw new ApiError(404, "Failed to login user");
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,"User logged in successfully",  
            {
                user:loggedInUser, 
                accessToken, 
                refreshToken
            })
    )
} catch (error) {
    throw new ApiError(500, error.message || "Something went wrong in login user");
}
})



export default { registerUser, loginUser }
import asyncHandler from "../utils/asyncHandler.js";
import Medicine from "../models/medicineModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const saveContent = asyncHandler(async (req, res) => {
    const { medicineName, content } = req.body;
    try {
        const savedContent = new Medicine({
            userId: req.user._id,
            medicineName,
            content,
        });
        await savedContent.save();
        return res.status(200).json({ message: "Content saved successfully" });
    } catch (error) {
        console.error(`Error saving content: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
});

const getContent = asyncHandler(async (req, res) => {
    try {
        const getContent = await Medicine.find({ userId: req.user._id });
        return res.status(200).json({ getContent });
    } catch (error) {
        console.error(`Error getting content: ${error.message}`);
        return res.status(500).json({ error: error.message });        
    }
});

export default { saveContent, getContent };
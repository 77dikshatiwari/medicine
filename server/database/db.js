import mongoose from "mongoose";
import DB_NAME from "../constant.js"
import dotenv from "dotenv"
dotenv.config({path: "./.env"})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connect !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MongoDB connection error : ${error}`)
        throw error
    }
}

export default connectDB
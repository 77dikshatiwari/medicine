import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import aiRoute from "./routes/aiRoute.js";
import medicineRoute from "./routes/MedicineRoute.js";

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("mongoDB connection failed", err));

app.use("/api/v1/", (req, res) => {
  res.send("Welcome to the HealthCare API");
});
app.use("/api/v1/users", userRoute)
app.use("/api/v1/ai", aiRoute)
app.use("/api/v1/medicine", medicineRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

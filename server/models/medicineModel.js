import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;

import mongoose from "mongoose";

const userVaccineSchema = new mongoose.Schema({

  babyInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BabyInfo",
    required: true
  },

  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vaccine",
    required: true
  },

  scheduledDate: Date,

  status: {
    type: String,
    enum: ["Pending", "Completed", "Missed"],
    default: "Pending"
  },

  completedDate: Date

}, { timestamps: true });

export default mongoose.model("UserVaccine", userVaccineSchema);
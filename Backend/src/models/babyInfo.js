import mongoose from "mongoose";

const babyInfoSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    babyName: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: null
    },

    bloodGroup: {
        type: String,
        default: null
    },

    motherConceiveDate: {
        type: Date,
        default: null
    }

}, { timestamps: true });

export default mongoose.model("BabyInfo", babyInfoSchema);

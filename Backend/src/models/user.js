import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // 🔹 Basic Info
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    address: String,
    dob: Date,
    emergencyContact: String,

    // 🍼 Pregnancy Details
    pregnancy: {
        lmp: Date,
        dueDate: Date,
        trimester: {
            type: Number,
            enum: [1, 2, 3]
        },
        previousPregnancies: {
            type: Number,
            default: 0
        },
        highRisk: {
            type: Boolean,
            default: false
        },
        bloodGroup: String
    },

    // 🏥 Medical Info
    medical: {
        conditions: [String],
        allergies: [String],
        complications: [String],
        medications: [String]
    },

    // 📄 Documents (your existing)
    documents: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: String,
            name: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
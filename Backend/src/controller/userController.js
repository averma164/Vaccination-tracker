import BabyInfo from "../models/babyInfo.js";
import User from "../models/user.js";

const allBaby = async (req, res) => {
    try {
        const userId = req.user.id;
        const babyInfo = await BabyInfo.find({ user: userId });
        res.status(200).json({
            count: babyInfo.length,
            babyInfo
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching baby info: " + error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatableFields = ["address", "dob", "emergencyContact", "pregnancy", "medical"];
        const updateData = {};
        
        for (const field of updatableFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -__v");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Error updating profile: " + error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Fetch profile error:", error);
        res.status(500).json({ message: "Error fetching profile: " + error.message });
    }
};

const registerBaby = async (req, res) => {
    try {
        const { babyName, dateOfBirth, motherConceiveDate, bloodGroup, gender } = req.body;
        const userId = req.user.id;

        const existingBaby = await BabyInfo.findOne({ user: userId });
        if (existingBaby) {
            return res.status(400).json({ message: "Only one child can be registered per account." });
        }

        if (!babyName || !dateOfBirth) {
            return res.status(400).json({ message: "Baby name and Date of Birth are mandatory." });
        }

        const newBaby = new BabyInfo({
            user: userId,
            babyName,
            dateOfBirth,
            gender: gender || null,
            bloodGroup: bloodGroup || null,
            motherConceiveDate: motherConceiveDate || null
        });

        await newBaby.save();
        res.status(201).json({ message: "Baby registered successfully!", baby: newBaby });
    } catch (error) {
        console.error("Register baby error:", error);
        res.status(500).json({ message: "Error registering baby: " + error.message });
    }
};

const updateBaby = async (req, res) => {
    try {
        const { babyName, dateOfBirth, motherConceiveDate, bloodGroup, gender } = req.body;
        const babyId = req.params.id;
        const userId = req.user.id;

        const baby = await BabyInfo.findOne({ _id: babyId, user: userId });
        if (!baby) {
            return res.status(404).json({ message: "Child not found." });
        }

        if (babyName) baby.babyName = babyName;
        if (dateOfBirth) baby.dateOfBirth = dateOfBirth;
        if (gender !== undefined) baby.gender = gender || null;
        if (bloodGroup !== undefined) baby.bloodGroup = bloodGroup || null;
        if (motherConceiveDate !== undefined) baby.motherConceiveDate = motherConceiveDate || null;

        await baby.save();
        res.status(200).json({ message: "Child updated successfully!", baby });
    } catch (error) {
        console.error("Update baby error:", error);
        res.status(500).json({ message: "Error updating baby: " + error.message });
    }
};

export { allBaby, updateProfile, getProfile, registerBaby, updateBaby };

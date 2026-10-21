const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Profile Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const {
            name,
            registerNumber,
            department,
            cgpa,
            percentage,
            backlogs,
            graduationYear,
            skills
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = name ?? user.name;
        user.registerNumber = registerNumber ?? user.registerNumber;
        user.department = department ?? user.department;
        user.cgpa = cgpa ?? user.cgpa;
        user.percentage = percentage ?? user.percentage;
        user.backlogs = backlogs ?? user.backlogs;
        user.graduationYear = graduationYear ?? user.graduationYear;
        user.skills = skills ?? user.skills;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                registerNumber: user.registerNumber,
                department: user.department,
                cgpa: user.cgpa,
                percentage: user.percentage,
                backlogs: user.backlogs,
                graduationYear: user.graduationYear,
                skills: user.skills
            }
        });

    } catch (error) {
        console.error("Profile Update Error:", error.message);

        res.status(500).json({
            message: "Failed to update profile"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function fixStudentRole() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({
            email: "suve06@gmail.com"
        });

        if (!user) {
            console.log("Student account not found.");
            return;
        }

        user.role = "student";
        await user.save();

        console.log("Suvetha account role updated to student.");
    } catch (error) {
        console.error("Role update failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

fixStudentRole();
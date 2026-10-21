
require("dotenv").config();
const mongoose = require("mongoose");
const readline = require("readline");
const User = require("./models/User");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        rl.question("Enter the email of the account to promote to admin: ", async (email) => {
            try {
                const user = await User.findOne({
                    email: email.trim().toLowerCase()
                });

                if (!user) {
                    console.log("No account found with that email.");
                } else {
                    user.role = "admin";
                    await user.save();
                    console.log(`Admin role assigned to ${user.email}`);
                }
            } catch (error) {
                console.error("Admin setup failed:", error.message);
            } finally {
                await mongoose.disconnect();
                rl.close();
            }
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        rl.close();
    }
}

main();

const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is missing. Copy backend/.env.example to backend/.env and configure your MongoDB connection.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        throw new Error(`MongoDB Connection Error: ${error.message}`, { cause: error });
    }
};

module.exports = connectDB;
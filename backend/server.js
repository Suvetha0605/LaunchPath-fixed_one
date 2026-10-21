const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const placementRoutes = require("./routes/placementRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (_req, res) => {
    res.json({ message: "Smart Placement Portal Backend is running!" });
});

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing. Configure it in backend/.env before starting the server.");
    }

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Unable to start backend:", error.message);
    process.exitCode = 1;
});

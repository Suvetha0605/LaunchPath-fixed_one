
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        placementDrive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlacementDrive",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Shortlisted", "Rejected", "Selected"],
            default: "Pending"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Prevent the same student from applying to the same drive twice
applicationSchema.index(
    { student: 1, placementDrive: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);

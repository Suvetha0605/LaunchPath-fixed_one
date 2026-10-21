const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        jobRole: {
            type: String,
            required: true,
            trim: true
        },

        package: {
            type: Number,
            required: true
        },

        jobLocation: {
            type: String,
            trim: true
        },

        driveDate: {
            type: Date,
            required: true
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        minimumCGPA: {
            type: Number,
            default: 0
        },

        minimumPercentage: {
            type: Number,
            default: 0
        },

        allowedDepartments: {
            type: [String],
            default: []
        },

        graduationYear: {
            type: Number
        },

        maximumBacklogs: {
            type: Number,
            default: 0
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        jobDescription: {
            type: String,
            trim: true
        },

        openings: {
            type: Number,
            default: 1
        },

        status: {
            type: String,
            enum: ["upcoming", "open", "closed"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "PlacementDrive",
    placementDriveSchema
);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        registerNumber: {
            type: String,
            trim: true
        },

        department: {
            type: String,
            trim: true
        },

        cgpa: {
            type: Number,
            min: 0,
            max: 10
        },

        percentage: {
            type: Number,
            min: 0,
            max: 100
        },

        backlogs: {
            type: Number,
            min: 0,
            default: 0
        },

        graduationYear: {
            type: Number
        },

        skills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
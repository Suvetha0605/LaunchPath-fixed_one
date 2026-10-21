
const Application = require("../models/Application");
const PlacementDrive = require("../models/PlacementDrive");
const User = require("../models/User");
const { checkEligibility } = require("../utils/eligibilityEngine");

// Apply for a placement drive
const applyForDrive = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { driveId } = req.body;

        if (!driveId) {
            return res.status(400).json({
                message: "Placement drive ID is required"
            });
        }

        const drive = await PlacementDrive.findById(driveId);

        if (!drive) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Check if student already applied
        const existingApplication = await Application.findOne({
            student: studentId,
            placementDrive: driveId
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this drive"
            });
        }

        // Validate drive status (must be open/active)
        if (drive.status === "closed") {
            return res.status(400).json({
                message: "This placement drive is closed."
            });
        }

        if (drive.status !== "open") {
            return res.status(400).json({
                message: "This placement drive is not currently open for applications."
            });
        }

        // Validate application deadline
        if (drive.applicationDeadline && new Date() > new Date(drive.applicationDeadline)) {
            return res.status(400).json({
                message: "The application deadline for this placement drive has passed."
            });
        }

        // Validate student eligibility
        const eligibility = checkEligibility(student, drive);

        if (eligibility.overallStatus !== "eligible") {
            const isProfileIncomplete = eligibility.overallStatus === "profile_incomplete";
            const failedChecks = (eligibility.checks || []).filter(
                (check) => check.status === "failed" || check.status === "missing"
            );

            return res.status(isProfileIncomplete ? 400 : 403).json({
                message: isProfileIncomplete
                    ? "Your profile is incomplete. Please complete your profile before applying."
                    : "You do not meet the eligibility criteria for this placement drive.",
                failedCriteria: failedChecks.map((c) => ({
                    criterion: c.criterion,
                    required: c.required,
                    studentValue: c.studentValue,
                    message: c.message
                })),
                eligibility
            });
        }

        const application = await Application.create({
            student: studentId,
            placementDrive: driveId
        });

        return res.status(201).json({
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already applied for this drive"
            });
        }

        console.error("Apply Error:", error.message);
        return res.status(500).json({
            message: "Failed to submit application"
        });
    }
};

// Get the logged-in student's applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user.id
        })
            .populate("placementDrive")
            .sort({ appliedAt: -1 });

        return res.status(200).json({
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error("Fetch Applications Error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("student", "name email registerNumber department")
            .populate("placementDrive", "companyName jobRole package")
            .sort({ appliedAt: -1 });

        return res.status(200).json({
            count: applications.length,
            applications
        });
    } catch (error) {
        console.error("Get All Applications Error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = [
            "Pending",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully",
            application
        });
    } catch (error) {
        console.error("Update Application Status Error:", error.message);
        return res.status(500).json({
            message: "Failed to update application status"
        });
    }
};

module.exports = {
    applyForDrive,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
};
const User = require("../models/User");
const PlacementDrive = require("../models/PlacementDrive");

const {
    checkEligibility
} = require("../utils/eligibilityEngine");

const {
    analyzeSkillGap
} = require("../utils/skillGapEngine");

const {
    calculateReadiness
} = require("../utils/readinessEngine");

const checkStudentEligibility = async (req, res) => {
    try {

        // Get logged-in student
        const student = await User.findById(
            req.user.id
        ).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        // Get placement drive
        const drive = await PlacementDrive.findById(
            req.params.id
        );

        if (!drive) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        // Run eligibility engine
        const result = checkEligibility(
            student,
            drive
        );
        // Run skill gap engine
const skillGap = analyzeSkillGap(
    student.skills || [],
    drive.requiredSkills || []
);
const readiness = calculateReadiness(
    result,
    skillGap
);

        res.status(200).json({
            message: "Eligibility analysis completed",
            student: {
                id: student._id,
                name: student.name,
                department: student.department,
                cgpa: student.cgpa,
                graduationYear: student.graduationYear,
                skills: student.skills
            },
            drive: {
                id: drive._id,
                companyName: drive.companyName,
                jobRole: drive.jobRole,
                package: drive.package
            },
            eligibility: result,
skillGap,

readiness
        });

    } catch (error) {

        console.error(
            "Eligibility Error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to analyze eligibility"
        });
    }
};

module.exports = {
    checkStudentEligibility
};
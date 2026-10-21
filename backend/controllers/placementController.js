const PlacementDrive = require("../models/PlacementDrive");

// Create a new placement drive

const createDrive = async (req, res) => {
    try {
        const {
            companyName,
            jobRole,
            package: salaryPackage,
            driveDate,
            applicationDeadline,
            minimumCGPA,
            minimumPercentage,
            maximumBacklogs,
            graduationYear
        } = req.body;

        if (
            !companyName?.trim() ||
            !jobRole?.trim() ||
            salaryPackage === undefined ||
            salaryPackage === null ||
            salaryPackage === "" ||
            !driveDate ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                message:
                    "Company name, job role, package, drive date and application deadline are required."
            });
        }

        if (
            !Number.isFinite(Number(salaryPackage)) ||
            Number(salaryPackage) <= 0
        ) {
            return res.status(400).json({
                message: "Package must be a positive number."
            });
        }

        if (
            !Number.isFinite(new Date(driveDate).getTime()) ||
            !Number.isFinite(new Date(applicationDeadline).getTime())
        ) {
            return res.status(400).json({
                message: "Please provide valid drive and deadline dates."
            });
        }

        if (new Date(applicationDeadline) > new Date(driveDate)) {
            return res.status(400).json({
                message: "Application deadline cannot be after the drive date."
            });
        }

        if (
            (minimumCGPA !== undefined &&
                (Number(minimumCGPA) < 0 || Number(minimumCGPA) > 10)) ||
            (minimumPercentage !== undefined &&
                (Number(minimumPercentage) < 0 ||
                    Number(minimumPercentage) > 100)) ||
            (maximumBacklogs !== undefined && Number(maximumBacklogs) < 0) ||
            (graduationYear !== undefined &&
                graduationYear !== "" &&
                !Number.isInteger(Number(graduationYear)))
        ) {
            return res.status(400).json({
                message: "Please check the eligibility criteria values."
            });
        }

        const drive = await PlacementDrive.create({
            ...req.body,
            companyName: companyName.trim(),
            jobRole: jobRole.trim(),
            package: Number(salaryPackage)
        });

        res.status(201).json({
            message: "Placement drive created successfully",
            drive
        });
    } catch (error) {
        console.error("Create Drive Error:", error.message);

        res.status(400).json({
            message: "Failed to create placement drive. Check the submitted data."
        });
    }
};



// Get all placement drives
const getAllDrives = async (req, res) => {
    try {
        const drives = await PlacementDrive.find()
            .sort({ driveDate: 1 });

        res.status(200).json({
            count: drives.length,
            drives
        });

    } catch (error) {
        console.error("Get Drives Error:", error.message);

        res.status(500).json({
            message: "Failed to fetch placement drives"
        });
    }
};


// Get one placement drive
const getDriveById = async (req, res) => {
    try {
        const drive = await PlacementDrive.findById(
            req.params.id
        );

        if (!drive) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        res.status(200).json({
            drive
        });

    } catch (error) {
        console.error("Get Drive Error:", error.message);

        res.status(500).json({
            message: "Failed to fetch placement drive"
        });
    }
};


// Update placement drive
const updateDrive = async (req, res) => {
    try {
        const drive = await PlacementDrive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        const {
            companyName,
            jobRole,
            package: salaryPackage,
            driveDate,
            applicationDeadline,
            minimumCGPA,
            minimumPercentage,
            maximumBacklogs,
            graduationYear,
            status,
            allowedDepartments,
            requiredSkills,
            jobLocation,
            jobDescription,
            openings
        } = req.body;

        if (companyName !== undefined && !companyName.trim()) {
            return res.status(400).json({
                message: "Company name cannot be empty."
            });
        }

        if (jobRole !== undefined && !jobRole.trim()) {
            return res.status(400).json({
                message: "Job role cannot be empty."
            });
        }

        if (
            salaryPackage !== undefined &&
            (!Number.isFinite(Number(salaryPackage)) || Number(salaryPackage) <= 0)
        ) {
            return res.status(400).json({
                message: "Package must be a positive number."
            });
        }

        const targetDriveDate =
            driveDate !== undefined ? new Date(driveDate) : drive.driveDate;
        const targetDeadline =
            applicationDeadline !== undefined
                ? new Date(applicationDeadline)
                : drive.applicationDeadline;

        if (
            driveDate !== undefined &&
            !Number.isFinite(targetDriveDate.getTime())
        ) {
            return res.status(400).json({
                message: "Please provide a valid drive date."
            });
        }

        if (
            applicationDeadline !== undefined &&
            !Number.isFinite(targetDeadline.getTime())
        ) {
            return res.status(400).json({
                message: "Please provide a valid application deadline."
            });
        }

        if (targetDeadline > targetDriveDate) {
            return res.status(400).json({
                message: "Application deadline cannot be after the drive date."
            });
        }

        if (
            (minimumCGPA !== undefined &&
                minimumCGPA !== "" &&
                (Number(minimumCGPA) < 0 || Number(minimumCGPA) > 10)) ||
            (minimumPercentage !== undefined &&
                minimumPercentage !== "" &&
                (Number(minimumPercentage) < 0 ||
                    Number(minimumPercentage) > 100)) ||
            (maximumBacklogs !== undefined &&
                maximumBacklogs !== "" &&
                Number(maximumBacklogs) < 0) ||
            (graduationYear !== undefined &&
                graduationYear !== "" &&
                graduationYear !== null &&
                !Number.isInteger(Number(graduationYear))) ||
            (openings !== undefined &&
                openings !== "" &&
                (!Number.isInteger(Number(openings)) || Number(openings) < 1))
        ) {
            return res.status(400).json({
                message: "Please check the eligibility criteria and openings values."
            });
        }

        if (
            status !== undefined &&
            !["upcoming", "open", "closed"].includes(status)
        ) {
            return res.status(400).json({
                message: "Status must be upcoming, open, or closed."
            });
        }

        // Apply updates
        if (companyName !== undefined) drive.companyName = companyName.trim();
        if (jobRole !== undefined) drive.jobRole = jobRole.trim();
        if (salaryPackage !== undefined) drive.package = Number(salaryPackage);
        if (jobLocation !== undefined) drive.jobLocation = jobLocation ? jobLocation.trim() : "";
        if (driveDate !== undefined) drive.driveDate = targetDriveDate;
        if (applicationDeadline !== undefined) drive.applicationDeadline = targetDeadline;
        if (minimumCGPA !== undefined) drive.minimumCGPA = minimumCGPA === "" ? 0 : Number(minimumCGPA);
        if (minimumPercentage !== undefined) drive.minimumPercentage = minimumPercentage === "" ? 0 : Number(minimumPercentage);
        if (maximumBacklogs !== undefined) drive.maximumBacklogs = maximumBacklogs === "" ? 0 : Number(maximumBacklogs);
        if (graduationYear !== undefined) drive.graduationYear = graduationYear ? Number(graduationYear) : undefined;
        if (openings !== undefined) drive.openings = openings === "" ? 1 : Number(openings);
        if (status !== undefined) drive.status = status;
        if (jobDescription !== undefined) drive.jobDescription = jobDescription ? jobDescription.trim() : "";

        if (allowedDepartments !== undefined) {
            drive.allowedDepartments = Array.isArray(allowedDepartments)
                ? allowedDepartments.map((d) => String(d).trim()).filter(Boolean)
                : String(allowedDepartments).split(",").map((d) => d.trim()).filter(Boolean);
        }

        if (requiredSkills !== undefined) {
            drive.requiredSkills = Array.isArray(requiredSkills)
                ? requiredSkills.map((s) => String(s).trim()).filter(Boolean)
                : String(requiredSkills).split(",").map((s) => s.trim()).filter(Boolean);
        }

        const updatedDrive = await drive.save();

        res.status(200).json({
            message: "Placement drive updated successfully",
            drive: updatedDrive
        });
    } catch (error) {
        console.error("Update Drive Error:", error.message);
        res.status(400).json({
            message: "Failed to update placement drive. Check the submitted data."
        });
    }
};

// Delete placement drive
const deleteDrive = async (req, res) => {
    try {
        const drive = await PlacementDrive.findByIdAndDelete(
            req.params.id
        );

        if (!drive) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        res.status(200).json({
            message: "Placement drive deleted successfully"
        });

    } catch (error) {
        console.error("Delete Drive Error:", error.message);

        res.status(500).json({
            message: "Failed to delete placement drive"
        });
    }
};

module.exports = {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive
};
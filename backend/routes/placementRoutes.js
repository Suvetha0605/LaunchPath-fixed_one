const express = require("express");

const {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive
} = require("../controllers/placementController");

const {
    checkStudentEligibility
} = require("../controllers/eligibilityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create placement drive
// Create placement drive - Admin only
router.post(
    "/",
    protect,
    protect.adminOnly,
    createDrive
);


// Get all placement drives
router.get("/", getAllDrives);


// Check student eligibility
router.get(
    "/:id/eligibility",
    protect,
    checkStudentEligibility
);


// Get one placement drive
router.get("/:id", getDriveById);


// Update placement drive - Admin only
router.put(
    "/:id",
    protect,
    protect.adminOnly,
    updateDrive
);


// Delete placement drive
// Delete placement drive - Admin only
router.delete(
    "/:id",
    protect,
    protect.adminOnly,
    deleteDrive
);


module.exports = router;

const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    applyForDrive,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

// Student routes
router.post("/", protect, applyForDrive);
router.get("/my", protect, getMyApplications);

// Admin-only routes
router.get(
    "/",
    protect,
    protect.adminOnly,
    getAllApplications
);

router.patch(
    "/:id/status",
    protect,
    protect.adminOnly,
    updateApplicationStatus
);

module.exports = router;

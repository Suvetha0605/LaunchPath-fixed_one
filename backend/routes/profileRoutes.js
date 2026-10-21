const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");

const router = express.Router();


// Get profile
router.get("/", protect, getProfile);


// Update profile
router.put("/", protect, updateProfile);


module.exports = router;
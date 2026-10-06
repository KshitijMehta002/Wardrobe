const express = require('express');
const router = express.Router();
const { registerUser, verifyOTP, resendOTP, loginUser, getusers, updateProfile } = require("../controllers/authController.js");
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');


router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.get("/users", protect, admin, getusers);
router.put("/profile", protect, updateProfile);

module.exports = router;

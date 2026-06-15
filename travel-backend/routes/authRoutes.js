const express = require("express");

const router = express.Router();

const {registerUser,loginUser,forgotPassword,resetPassword,updateProfile,changePassword} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/register", registerUser);
router.post("/login",loginUser);
router.put("/update-profile",authMiddleware,updateProfile)
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.put("/change-password",authMiddleware,changePassword);

module.exports = router;
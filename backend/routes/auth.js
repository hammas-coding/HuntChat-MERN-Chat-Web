const express = require("express");
const { check } = require("express-validator");
const {
  register,
  verifyOtp,
  login,
  getUsers,
} = require("../controllers/authController");

const router = express.Router();
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("profilePic", "Profile picture URL is optional").optional().isURL(),
  ],
  register
);

router.post(
  "/verify-otp",
  [
    check("email", "Please include a valid email").isEmail(),
    check("otp", "OTP is required").notEmpty(),
  ],
  verifyOtp
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.get("/users", getUsers);

module.exports = router;

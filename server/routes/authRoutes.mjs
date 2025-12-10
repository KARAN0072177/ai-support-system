import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.mjs";
import PendingUser from "../models/PendingUser.mjs";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/email.mjs";

const router = express.Router();

// Helper to generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /api/auth/signup
 * 1) Validate
 * 2) Check username & email uniqueness
 * 3) Create PendingUser with OTP (10 min expiry)
 * 4) Send OTP email
 * 5) Return pendingId so frontend can go to OTP page
 */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match." });
    }

    // Basic extra validation (optional)
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // 2. Check if username or email already exists in real users
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    // Also check in PendingUser (someone might be in the middle of signup)
    const existingPending = await PendingUser.findOne({
      $or: [{ email }, { username }],
    });
    if (existingPending) {
      return res.status(400).json({
        message:
          "There is already a pending signup with this username or email. Please check your email for OTP.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const pendingUser = await PendingUser.create({
      username,
      email,
      passwordHash,
      otp,
      otpExpiresAt,
    });

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      pendingId: pendingUser._id,
      email,
      username,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { pendingId, otp }
 * 1) Find PendingUser
 * 2) Check OTP & expiry
 * 3) Create real User, delete PendingUser
 * 4) Send welcome email
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { pendingId, otp } = req.body;

    if (!pendingId || !otp) {
      return res
        .status(400)
        .json({ message: "pendingId and otp are required." });
    }

    const pendingUser = await PendingUser.findById(pendingId);
    if (!pendingUser) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP session. Please sign up again." });
    }

    if (pendingUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingUser.findByIdAndDelete(pendingId);
      return res.status(400).json({ message: "OTP has expired. Please sign up again." });
    }

    // Before creating user, double-check uniqueness again
    const existingUser = await User.findOne({
      $or: [{ email: pendingUser.email }, { username: pendingUser.username }],
    });
    if (existingUser) {
      await PendingUser.findByIdAndDelete(pendingId);
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    const user = await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      passwordHash: pendingUser.passwordHash,
    });

    await PendingUser.findByIdAndDelete(pendingId);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username);

    return res.json({
      message: "OTP verified. Account created successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
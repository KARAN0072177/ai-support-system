import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.mjs"; // your existing middleware
import { getProfile, updateProfile } from "../controllers/profileController.mjs";
import { avatarUploadMiddleware, uploadAvatar } from "../controllers/avatarController.mjs";

const router = express.Router();

// get current profile (alias to /api/auth/me if you prefer)
router.get("/me", authMiddleware, getProfile);

// update profile fields
router.put("/me", authMiddleware, updateProfile);

// upload avatar
router.post("/avatar", authMiddleware, avatarUploadMiddleware, uploadAvatar);

export default router;
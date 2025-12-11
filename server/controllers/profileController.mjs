import User from "../models/User.mjs";
import GoogleUser from "../models/GoogleUser.mjs";
import path from "path";
import fs from "fs";

/**
 * Helper: find user by id+provider
 */
const findUserByPayload = async (payload) => {
  // payload expected to have: userId and provider (provider optional)
  const id = payload.userId || payload.id || payload.userID;
  const provider = (payload.provider || "local").toLowerCase();
  if (provider === "google") {
    return await GoogleUser.findById(id);
  }
  return await User.findById(id);
};

export const getProfile = async (req, res) => {
  try {
    // req.auth should be populated by your authMiddleware
    if (!req.auth) return res.status(401).json({ message: "Not authenticated" });
    return res.json({ user: req.auth });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.auth) return res.status(401).json({ message: "Not authenticated" });

    const { displayName, bio, language, timezone, notificationPrefs } = req.body;
    const provider = req.auth.provider || "local";
    const id = req.auth.id;

    let userModel = provider === "google" ? GoogleUser : User;
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (language !== undefined) user.language = language;
    if (timezone !== undefined) user.timezone = timezone;
    if (notificationPrefs !== undefined) {
      user.notificationPrefs = { ...user.notificationPrefs, ...notificationPrefs };
    }

    await user.save();

    // return normalized user (similar to auth/me)
    const normalized = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || user.avatar || null,
      bio: user.bio || "",
      language: user.language || "en",
      timezone: user.timezone || "UTC",
      notificationPrefs: user.notificationPrefs,
      provider,
    };

    return res.json({ user: normalized });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
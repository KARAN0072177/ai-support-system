import User from "../models/User.mjs";
import GoogleUser from "../models/GoogleUser.mjs";

/**
 * POST /api/auth/google/set-username
 * Body: { pendingId, username }
 */
export const setGoogleUsername = async (req, res) => {
  try {
    const { pendingId, username } = req.body;

    if (!pendingId || !username) {
      return res.status(400).json({ message: "pendingId and username are required." });
    }

    const gUser = await GoogleUser.findById(pendingId);
    if (!gUser) {
      return res.status(404).json({ message: "Pending Google signup not found." });
    }

    if (gUser.isUsernameSet) {
      return res.status(400).json({ message: "Username already set for this account." });
    }

    const trimmed = username.trim();

    // Check uniqueness across local users and google users
    const existsLocal = await User.findOne({ username: trimmed });
    const existsGoogle = await GoogleUser.findOne({ username: trimmed });

    if (existsLocal || existsGoogle) {
      return res.status(400).json({ message: "Username already in use." });
    }

    // assign username
    gUser.username = trimmed;
    gUser.isUsernameSet = true;
    await gUser.save();

    return res.json({
      message: "Username set successfully. Please login using Google.",
      username: gUser.username,
      email: gUser.email,
    });
  } catch (err) {
    console.error("setGoogleUsername error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
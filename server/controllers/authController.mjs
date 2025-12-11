/**
 * GET /api/auth/me
 * Returns: { user: { id, username, email, avatar?, provider } }
 * Requires authMiddleware to have populated req.auth
 */
export const getMe = async (req, res) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // req.auth already contains id, username, email, provider, avatar (from authMiddleware)
    return res.json({ user: req.auth });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
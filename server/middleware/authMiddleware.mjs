import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import GoogleUser from "../models/GoogleUser.mjs";

/**
 * authMiddleware
 * - Looks for token in cookie (req.cookies.token) OR Authorization header "Bearer <token>"
 * - Verifies token and attaches normalized auth info to req.auth
 * - Call next() on success, else returns 401
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1) read token
    let token = undefined;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2) verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 3) normalize: payload should have userId and maybe provider
    const userId = payload.userId || payload.userID || payload.id; // tolerate variants
    const provider = payload.provider || "local";

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 4) fetch minimal user record and attach to req.auth
    if (provider === "google") {
      const gUser = await GoogleUser.findById(userId).select("username email avatar provider");
      if (!gUser) return res.status(401).json({ message: "Invalid token user" });
      req.auth = {
        id: gUser._id.toString(),
        username: gUser.username,
        email: gUser.email,
        avatar: gUser.avatar,
        provider: "google",
      };
      return next();
    }

    // default: local user
    const localUser = await User.findById(userId).select("username email provider");
    if (!localUser) return res.status(401).json({ message: "Invalid token user" });

    req.auth = {
      id: localUser._id.toString(),
      username: localUser.username,
      email: localUser.email,
      provider: localUser.provider || "local",
    };

    return next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
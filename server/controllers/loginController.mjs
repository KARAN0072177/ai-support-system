import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Basic validation
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Username/email and password are required." });
    }

    const trimmedIdentifier = identifier.trim();

    // Find by username OR email
    const user = await User.findOne({
      $or: [
        { email: trimmedIdentifier.toLowerCase() },
        { username: trimmedIdentifier },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create JWT (we’ll use this later for protected routes)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
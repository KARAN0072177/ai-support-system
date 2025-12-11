import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import User from "../models/User.mjs";
import GoogleUser from "../models/GoogleUser.mjs";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const avatarUploadMiddleware = upload.single("avatar");

// POST /api/profile/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.auth) return res.status(401).json({ message: "Not authenticated" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // process: crop/resize to square 256x256 and compress jpg/webp
    const imgBuffer = req.file.buffer;
    const outDir = path.resolve("uploads", "avatars");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outPath = path.join(outDir, filename);

    // process with sharp
    await sharp(imgBuffer)
      .rotate()
      .resize(512, 512, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(outPath);

    // store relative url (serve static files in server.mjs)
    const publicUrl = `/uploads/avatars/${filename}`;

    // update user record (avatarUrl)
    const provider = req.auth.provider || "local";
    const id = req.auth.id;
    const model = provider === "google" ? GoogleUser : User;
    const user = await model.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatarUrl = publicUrl;
    await user.save();

    return res.json({ avatarUrl: publicUrl });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
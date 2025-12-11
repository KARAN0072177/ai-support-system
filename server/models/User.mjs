import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    // profile fields
    displayName: { type: String }, // optional display name
    bio: { type: String }, // bio with links allowed (stored as plain text)
    avatarUrl: { type: String }, // stored url to processed avatar
    language: { type: String, default: "en" },
    timezone: { type: String, default: "UTC" },
    notificationPrefs: {
      newsletter: { type: String, enum: ["weekly", "biweekly", "monthly", "off"], default: "weekly" },
      updates: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    name: { type: String },
    avatar: { type: String },
    username: { type: String, unique: true, sparse: true },
    isUsernameSet: { type: Boolean, default: false },
    provider: { type: String, default: "google" },

    // profile fields
    displayName: { type: String },
    bio: { type: String },
    avatarUrl: { type: String },
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

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);
export default GoogleUser;
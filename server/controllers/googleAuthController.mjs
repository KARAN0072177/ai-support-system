import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.mjs"; // existing local user model
import GoogleUser from "../models/GoogleUser.mjs";

export const googleCallbackHandler = async (req, res) => {
  try {
    // passport attached user object in verify callback
    const { profile } = req.user;
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const name = profile.displayName || "";
    const avatar = profile.photos?.[0]?.value || "";

    if (!email) {
      // no email — cannot proceed
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth=google_no_email`);
    }

    // If a GoogleUser with same googleId exists, reuse it.
    let gUser = await GoogleUser.findOne({ googleId });

    if (!gUser) {
      // create GoogleUser doc; username left empty for now
      gUser = await GoogleUser.create({
        googleId,
        email,
        name,
        avatar,
        isUsernameSet: false,
      });
    } else {
      // update basic profile info
      gUser.email = email;
      gUser.name = name;
      gUser.avatar = gUser.avatar || avatar;
      await gUser.save();
    }

    // Redirect user to frontend set-username page with pendingId query param
    const redirectBase = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${redirectBase}/set-username?pendingId=${gUser._id}`);
  } catch (err) {
    console.error("Google callback error:", err);
    const redirectBase = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${redirectBase}/?auth=google_error`);
  }
};
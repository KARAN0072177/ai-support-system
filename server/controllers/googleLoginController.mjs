import jwt from "jsonwebtoken";
import GoogleUser from "../models/GoogleUser.mjs";

export const googleLoginHandler = async (req, res) => {
  try {
    console.log("=== GOOGLE LOGIN CALLBACK ===");

    const { profile } = req.user; // from passport verify
    console.log("GOOGLE PROFILE RAW:", JSON.stringify(profile, null, 2));

    const googleId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const name = profile.displayName || "";
    const avatar = profile.photos?.[0]?.value || "";

    console.log("EXTRACTED googleId:", googleId);
    console.log("EXTRACTED email:", email);

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

    if (!email) {
      console.log("ERROR: No email returned by Google");
      return res.redirect(`${frontend}/?auth=google_no_email`);
    }

    // Find by googleId first
    console.log("Searching GoogleUser by googleId...");
    let gUser = await GoogleUser.findOne({ googleId });
    console.log("FOUND by googleId:", gUser);

    // If not found by googleId, try by email
    if (!gUser) {
      console.log("Not found by googleId, searching by email...");
      gUser = await GoogleUser.findOne({ email });
      console.log("FOUND by email:", gUser);
    }

    if (!gUser) {
      console.log("NO EXISTING GOOGLE USER FOUND → Creating pending GoogleUser...");

      gUser = await GoogleUser.create({
        googleId,
        email,
        name,
        avatar,
        isUsernameSet: false,
      });

      console.log("NEW GOOGLE USER CREATED:", gUser);

      return res.redirect(`${frontend}/set-username?pendingId=${gUser._id}`);
    }

    console.log("EXISTING GOOGLE USER FOUND:", gUser);

    // Update basic profile info
    gUser.email = email;
    gUser.name = name;
    gUser.avatar = gUser.avatar || avatar;
    await gUser.save();

    console.log("PROFILE UPDATED. isUsernameSet:", gUser.isUsernameSet);

    // If username not set yet → redirect to set-username
    if (!gUser.isUsernameSet) {
      console.log("USERNAME NOT SET → redirecting to set-username");
      return res.redirect(`${frontend}/set-username?pendingId=${gUser._id}`);
    }

    // Username set → issue JWT
    console.log("USERNAME FOUND → Logging user in");

    const payload = {
      userId: gUser._id,
      provider: "google",
      username: gUser.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("JWT GENERATED:", token);

    return res.redirect(`${frontend}/#google_token=${token}`);
  } catch (err) {
    console.error("googleLoginHandler error:", err);
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontend}/?auth=google_error`);
  }
};
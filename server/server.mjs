import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mjs";
import healthRoute from "./routes/healthRoute.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import { loginUser } from "./controllers/loginController.mjs";
import passport from "passport";
import cookieParser from "cookie-parser";
import configurePassport from "./passportConfig.mjs";
import { googleCallbackHandler } from "./controllers/googleAuthController.mjs";
import { setGoogleUsername } from "./controllers/googleSetUsernameController.mjs";
import { googleLoginHandler } from "./controllers/googleLoginController.mjs";
import { authMiddleware } from "./middleware/authMiddleware.mjs";
import { getMe } from "./controllers/authController.mjs";
import profileRoutes from "./routes/profileRoute.mjs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

configurePassport();
app.use(passport.initialize());
app.use(cookieParser());

// Connect DB
connectDB();

// TEMP (optional) sanity ping — you can keep or remove
app.get("/_ping_log", (req, res) => {
  console.log("PING_LOG HIT", new Date().toISOString(), "host:", req.headers.host);
  res.send("pong");
});

// Request logger (temporary - helpful for debugging; remove if you don't want logs for every request)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// Routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.post("/api/auth/login", loginUser);

// --- START OAUTH FLOWS ---
// Use state to mark whether the flow is 'signup' or 'login'.
// Google will return the same state value to the callback.

// Signup start (keeps existing behavior)
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "signup",
  })
);

// Login start (separate entry point, sends state=login)
app.get(
  "/api/auth/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login",
  })
);

// Single callback used by both flows (must match GOOGLE_CALLBACK_URL in Google console)
app.get(
  "/api/auth/google/callback",
  (req, res, next) => {
    // log incoming query for debugging
    console.log(">>> GOOGLE CALLBACK HIT (query):", req.query);
    next();
  },
  (req, res) => {
    // Use custom callback to capture passport result
    passport.authenticate("google", { session: false }, (err, user, info) => {
      console.log(">>> passport authenticate -> err:", err);
      console.log(">>> passport authenticate -> user:", !!user);
      console.log(">>> passport authenticate -> info:", info);

      if (err) {
        console.error("Passport error during callback:", err);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth=google_error`);
      }

      if (!user) {
        console.warn("Passport returned no user. Info:", info);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/?auth=google_failed`);
      }

      // attach passport user payload
      req.user = user;

      // decide which flow invoked OAuth via state param
      const state = (req.query.state || "").toString().toLowerCase();

      if (state === "login") {
        // login flow: will issue JWT if username set, otherwise redirect to set-username
        return googleLoginHandler(req, res);
      }

      // default (or state === 'signup'): signup flow handler (creates pending GoogleUser → set-username)
      return googleCallbackHandler(req, res);
    })(req, res);
  }
);

// Set username endpoint (frontend calls this after user supplies username)
app.post("/api/auth/google/set-username", setGoogleUsername);
// Protected endpoint: who am I
app.get("/api/auth/me", authMiddleware, getMe);

// after other app.use
app.use("/api/profile", profileRoutes);

// serve uploads folder statically
app.use("/uploads", express.static("uploads"));

// root
app.get("/", (req, res) => {
  res.send("AI Support System API (MJS version)");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
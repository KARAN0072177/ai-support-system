import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mjs";
import healthRoute from "./routes/healthRoute.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import { loginUser } from "./controllers/loginController.mjs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.post("/api/auth/login", loginUser);

app.get("/", (req, res) => {
  res.send("AI Support System API (MJS version)");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
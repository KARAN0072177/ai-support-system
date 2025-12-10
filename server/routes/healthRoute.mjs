import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI support API is running 🚀" });
});

export default router;
import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.middleware.js";
import Contact from "../models/contact.model.js";

const router = express.Router();

/**
 * 🔐 Admin Login
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
});

/**
 * 📬 Get All Messages (Protected)
 */
router.get("/messages", authMiddleware, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

export default router;

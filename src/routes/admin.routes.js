import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import Contact from "../models/contact.model.js";

const router = express.Router();

/**
 * 🔐 Admin Login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

/**
 * 📬 Get All Messages (Protected)
 */
router.get("/messages", authMiddleware, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: messages
  });
});

export default router;

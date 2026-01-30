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

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

/**
 * 📬 Get Messages (PAGINATED)
 */
router.get("/messages", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      messages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

/**
 * ✅ Mark Message as Read
 */
router.patch("/messages/:id/read", authMiddleware, async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
});

/**
 * 🗑 Delete Message
 */
router.delete("/messages/:id", authMiddleware, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

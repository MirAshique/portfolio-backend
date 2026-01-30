import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import Contact from "../models/contact.model.js";

const router = express.Router();

/* 🔐 LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
});

/* 📬 GET MESSAGES (Pagination only) */
router.get("/messages", authMiddleware, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
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
      page,
      pages: Math.ceil(total / limit),
      total,
    },
  });
});

/* 🗑 DELETE */
router.delete("/messages/:id", authMiddleware, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

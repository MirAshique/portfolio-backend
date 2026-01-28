import express from "express";
import Contact from "../models/contact.model.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 1️⃣ Save message
    await Contact.create({ name, email, message });

    // 2️⃣ Respond IMMEDIATELY
    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });

    // 3️⃣ Send email AFTER response (safe)
    setImmediate(() => {
      sendEmail({ name, email, message });
    });

  } catch (error) {
    console.error("❌ Contact API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
});

export default router;

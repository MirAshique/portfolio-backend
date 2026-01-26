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

    // Save to MongoDB
    await Contact.create({ name, email, message });

    // Send email
    await sendEmail({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("❌ Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
});

export default router;

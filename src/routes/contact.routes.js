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

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters"
      });
    }

    const contact = await Contact.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { id: contact._id }
    });

    setImmediate(() => {
      sendEmail({ name, email, message });
    });

  } catch (error) {
    console.error("❌ Contact API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
});

export default router;

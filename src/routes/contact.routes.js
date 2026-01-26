import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    console.log("📩 New Contact Message:", {
      name,
      email,
      message
    });

    res.status(200).json({
      success: true,
      message: "Message received successfully"
    });
  } catch (error) {
    console.error("❌ Contact API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;

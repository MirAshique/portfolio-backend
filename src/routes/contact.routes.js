import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // For now, just log (later we'll save to DB or send email)
  console.log("📩 New Contact Message:", { name, email, message });

  res.status(200).json({
    success: true,
    message: "Message received successfully"
  });
});

export default router;

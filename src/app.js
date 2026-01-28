import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
const app = express();

// ✅ MUST be before routes
app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("Portfolio Backend is running 🚀");
});

export default app;

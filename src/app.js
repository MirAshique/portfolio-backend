import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio Backend is running 🚀",
  });
});

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;

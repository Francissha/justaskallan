import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";

import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

dotenv.config();

console.log(process.env.ADMIN_EMAIL);
console.log(process.env.ADMIN_PASSWORD);

const app = express();

// Enable CORS for frontend (Vite dev server)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("JustAskAllan Backend API is Running 🚀");
});

// Test Route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JustAskAllan API",
  });
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
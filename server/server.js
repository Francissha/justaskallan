import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  // Production Frontend
  "https://www.justaskallan.com",
  "https://justaskallan.com",
  // Old Vercel Frontend
  "https://justaskallanke.vercel.app",
  // Backend URL (optional)
  "https://justaskallan.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "JustAskAllan API Running 🚀",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JustAskAllan API",
  });
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

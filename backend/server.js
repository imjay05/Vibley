import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/DB.js";
import authRoutes from "./routes/AuthRoute.js";
import messageRoutes from "./routes/MessageRoute.js";
import userRoutes from "./routes/UserRoute.js";
import vibeRoutes from "./routes/VibeRoute.js";
import { app, server } from "./lib/Socket.js";

const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vibes", vibeRoutes);

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error("Failed to connect to DB:", err);
  process.exit(1);
});
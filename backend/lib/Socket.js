import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",         
  process.env.FRONTEND_URL,
].filter(Boolean);                           

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    try {
      const sentMessages = await Message.find({
        receiverId: userId,
        status: "sent",
      });

      if (sentMessages.length > 0) {
        await Message.updateMany(
          { receiverId: userId, status: "sent" },
          { $set: { status: "delivered" } }
        );

        const senderIds = [
          ...new Set(sentMessages.map((m) => m.senderId.toString())),
        ];

        senderIds.forEach((senderId) => {
          const senderSocket = getReceiverSocketId(senderId);
          if (senderSocket) {
            io.to(senderSocket).emit("messagesDelivered", { to: userId });
          }
        });
      }
    } catch (err) {
      console.error("Socket error:", err.message);
    }
  }

  socket.on("disconnect", () => {
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
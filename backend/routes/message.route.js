import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage, deleteMessage, getUnreadCounts } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/unread", protectRoute, getUnreadCounts);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessage);

export default router;
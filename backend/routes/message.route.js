import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage, getUnreadCounts, deleteChatForMe } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/unread", protectRoute, getUnreadCounts);
router.put("/delete-chat/:id", protectRoute, deleteChatForMe);

router.post("/send/:id", protectRoute, sendMessage);

router.get("/:id", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessage);

export default router;
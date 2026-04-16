import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage, getUnreadCounts, deleteChatForMe, reactToMessage } from "../controllers/message.controller.js";
import { createGroup, getUserGroups, getGroupMembers} from "../controllers/group.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/unread", protectRoute, getUnreadCounts);
router.put("/delete-chat/:id", protectRoute, deleteChatForMe);

router.post("/group", protectRoute, createGroup);
router.get("/group", protectRoute, getUserGroups);
router.get("/group/:id/members", protectRoute, getGroupMembers);

router.post("/send/:id", protectRoute, sendMessage);

router.get("/:id", protectRoute, getMessages);
router.delete("/:id", protectRoute, deleteMessage);
router.post("/:id/react", protectRoute, reactToMessage);

export default router;
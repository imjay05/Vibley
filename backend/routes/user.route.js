import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/friends", protectRoute, getFriends);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);

export default router;
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getFriendsVibes,
  getMyVibe,
  generateMemeOptions,
  postVibe,
  deleteVibe,
  replyToVibe,
} from "../controllers/vibe.controller.js";

const router = express.Router();

router.get("/friends", protectRoute, getFriendsVibes);
router.get("/mine", protectRoute, getMyVibe);
router.post("/generate", protectRoute, generateMemeOptions);
router.post("/", protectRoute, postVibe);
router.delete("/:id", protectRoute, deleteVibe);
router.post("/:id/reply", protectRoute, replyToVibe);

export default router;
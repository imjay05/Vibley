import Vibe from "../models/vibe.model.js";
import cloudinary from "../lib/cloudinary.js";


// GET /api/vibes/friends
export const getFriendsVibes = async (req, res) => {
  try {
    const friendIds = req.user.friends;
    const vibes = await Vibe.find({
      userId: { $in: friendIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("userId", "fullName profilePic")
      .populate("replies.fromId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json(vibes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /api/vibes/mine
export const getMyVibe = async (req, res) => {
  try {
    const vibe = await Vibe.findOne({
      userId: req.user._id,
      expiresAt: { $gt: new Date() },
    });
    res.json(vibe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST /api/vibes/generate 
export const generateMemeOptions = async (req, res) => {
  try {
    const imgflipRes = await fetch("https://api.imgflip.com/get_memes");
    const imgflipData = await imgflipRes.json();

    if (!imgflipData.success) {
      return res.status(500).json({ error: "Failed to fetch memes from Imgflip" });
    }

    const memes = imgflipData.data.memes;
    const random = memes[Math.floor(Math.random() * memes.length)];

    const pick = {
      templateId: random.id,
      caption: random.name,
      imageUrl: random.url,
      topText: "",
      bottomText: "",
    };

    res.json({ options: [pick] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST /api/vibes — upload meme + save vibe
export const postVibe = async (req, res) => {
  try {
    const { moodText, templateId, topText, bottomText, caption, imageUrl } = req.body;

    let memeImageUrl = imageUrl;

    // If no direct imageUrl, render via Imgflip caption API
    if (!memeImageUrl) {
      const form = new URLSearchParams({
        template_id: templateId,
        username: process.env.IMGFLIP_USERNAME,
        password: process.env.IMGFLIP_PASSWORD,
        text0: topText || "",
        text1: bottomText || "",
      });

      const imgflipRes = await fetch("https://api.imgflip.com/caption_image", {
        method: "POST",
        body: form,
      });
      const imgflipData = await imgflipRes.json();
      if (!imgflipData.success) throw new Error(imgflipData.error_message);
      memeImageUrl = imgflipData.data.url;
    }

    // Upload to Cloudinary
    const upload = await cloudinary.uploader.upload(memeImageUrl, { folder: "vibes" });

    // Save vibe
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const vibe = await Vibe.create({
      userId: req.user._id,
      memeUrl: upload.secure_url,
      moodText,
      caption,
      expiresAt,
    });

    await vibe.populate("userId", "fullName profilePic");
    res.status(201).json(vibe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// DELETE /api/vibes/:id
export const deleteVibe = async (req, res) => {
  try {
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) return res.status(404).json({ error: "Not found" });
    if (vibe.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    await Vibe.findByIdAndDelete(req.params.id);
    res.json({ message: "Vibe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// POST /api/vibes/:id/reply
export const replyToVibe = async (req, res) => {
  try {
    const { text } = req.body;
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) return res.status(404).json({ error: "Not found" });

    vibe.replies.push({ fromId: req.user._id, text });
    await vibe.save();
    await vibe.populate("replies.fromId", "fullName profilePic");

    res.json(vibe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
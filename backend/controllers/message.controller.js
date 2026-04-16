import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      {
        senderId: userToChatId,
        receiverId: myId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const senderSocketId = getReceiverSocketId(userToChatId);
    
    if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
            by: myId,
        });
    }

    const messages = await Message.find({
        $and: [
            {
                $or: [
                    { 
                        senderId: myId, 
                        receiverId: userToChatId 
                    }, { 
                        senderId: userToChatId, 
                        receiverId: myId 
                    },
                ],
            },
            {
                createdAt: { $gte: sevenDaysAgo },
            }, {
                deletedFor: { $ne: myId }, 
            },
        ],
    }).populate("replyTo", "text image senderId");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, groupId, replyTo: replyToId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    console.log("=== SEND MESSAGE DEBUG ===");
    console.log("senderId:", senderId);
    console.log("receiverId:", receiverId);
    console.log("text:", text);
    console.log("image:", image ? "YES (base64)" : "NO");
    console.log("groupId:", groupId);
    console.log("==========================");

    let imageUrl;

    if (image) {
      console.log("Uploading image to cloudinary...");
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
      console.log("Image uploaded:", imageUrl);
    }


    if (!text && !image) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newMessage = new Message({
      senderId,
      receiverId: groupId ? null : receiverId,
      groupId: groupId || null,
      text,
      image: imageUrl,
      seen: false,
      replyTo: replyToId || null,
    });

    await newMessage.save();
    await newMessage.populate("replyTo", "text image senderId");
    console.log("Message saved successfully:", newMessage._id);

    if (!groupId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("=== SEND MESSAGE ERROR ===");
    console.log("Error message:", error.message);
    console.log("Full error:", error);
    console.log("==========================");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteFor } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (deleteFor === "everyone") {
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await Message.findByIdAndDelete(id);
    } else {
      await Message.findByIdAndUpdate(id, {
        $addToSet: { deletedFor: userId },
      });
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.log("Error deleting message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const counts = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChatForMe = async (req, res) => {
  try {
    const { id: otherUserId } = req.params;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Message.updateMany(
      {
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
        createdAt: { $gte: today }, // only today's messages
      },
      {
        $addToSet: { deletedFor: userId },
      }
    );

    res.json({ message: "Chat deleted for you (today only)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Not found" });

    // Remove existing reaction from this user, then add new one
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );
    message.reactions.push({ userId, emoji });
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
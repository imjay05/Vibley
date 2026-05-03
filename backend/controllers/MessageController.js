import Message from "../models/Message.js";
import cloudinary from "../lib/Cloudinary.js";
import { getReceiverSocketId, io } from "../lib/Socket.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Mark incoming messages as seen
    await Message.updateMany(
      { 
        senderId: userToChatId, 
        receiverId: myId, 
        status: { $ne: "seen" } 
      }, { 
        $set: { status: "seen" } 
      }
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Notify the sender that their messages have been seen
    const senderSocketId = getReceiverSocketId(userToChatId);
    if (senderSocketId) {
      io
       .to(senderSocketId)
       .emit("messagesSeen", { by: myId });
    }

    const messages = await Message.find({
      $and: [
        {
          $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
          ],
        },
        { createdAt: { $gte: sevenDaysAgo } },
        { deletedFor: { $ne: myId } },
      ],
    }).populate("replyTo", "text image senderId");

    res
      .status(200)
      .json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res
      .status(500)
      .json({ 
        error: "Internal server error" 
      });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo: replyToId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    if (!text && !image) {
      return res
               .status(400)
               .json({ 
                error: "Message cannot be empty" 
              });
    }

    // If receiver is online, mark as delivered immediately; otherwise sent
    const receiverSocketId = getReceiverSocketId(receiverId);
    const initialStatus = receiverSocketId ? "delivered" : "sent";

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      status: initialStatus,
      replyTo: replyToId || null,
    });

    await newMessage.save();
    await newMessage.populate("replyTo", "text image senderId");

    if (receiverSocketId) {
      io
       .to(receiverSocketId)
       .emit("newMessage", newMessage);
    }

    res
      .status(201)
      .json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res
      .status(500)
      .json({ 
        error: "Internal server error" 
      });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteFor } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message){
      return res
               .status(404)
               .json({ 
                message: "Message not found" 
              });
    }

    if (deleteFor === "everyone") {
      if (message.senderId.toString() !== userId.toString()) {
        return res
                 .status(403)
                 .json({ 
                  message: "Unauthorized" 
                });
      }
      await Message.findByIdAndDelete(id);
    } else {
      await Message.findByIdAndUpdate(id, {
        $addToSet: { deletedFor: userId },
      });
    }

    res
      .status(200)
      .json({ 
        message: "Message deleted" 
      });
  } catch (error) {
    console.log("Error deleting message:", error.message);
    res
      .status(500)
      .json({ 
        error: "Internal server error" 
      });
  }
};


export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;
    const counts = await Message.aggregate([
      { $match: { receiverId: userId, status: { $ne: "seen" }} },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);
    res.json(counts);
  } catch (error) {
    res
      .status(500)
      .json({ 
        error: error.message 
      });
  }
};
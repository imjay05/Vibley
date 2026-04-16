import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    const users = await User.find({
      $and: [
        { fullName: { $regex: query, $options: "i" } },
        { _id: { $ne: req.user._id } }
      ]
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const fromId = req.user._id;
    const toId = req.params.id;

    const targetUser = await User.findById(toId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (targetUser.friends.some(id => id.toString() === fromId.toString())) {
      return res.status(400).json({ message: "Already friends" });
    }

    const isPending = targetUser.friendRequests.some(
      (r) => r.from.toString() === fromId.toString()
    );
    if (isPending) {
      return res.status(400).json({ message: "Request already sent" });
    }

    targetUser.friendRequests.push({ from: fromId });
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const senderId = req.params.id;

    const me = await User.findById(myId);
    const sender = await User.findById(senderId);

    if (!me || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!sender) return res.status(404).json({ message: "User not found" });

    me.friendRequests = me.friendRequests.filter(
      (r) => r.from.toString() !== senderId.toString()
    );
    if (!me.friends.includes(senderId)) me.friends.push(senderId);
    if (!sender.friends.includes(myId)) sender.friends.push(myId);

    await me.save();
    await sender.save();

    res.status(200).json({ message: "Request accepted! You are now friends 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const senderId = req.params.id;

    const me = await User.findById(myId);

    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }
    
    me.friendRequests = me.friendRequests.filter(
      (r) => r.from.toString() !== senderId.toString()
    );
    await me.save();

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "-password");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friendRequests.from", "-password");
    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
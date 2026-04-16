import Group from "../models/group.model.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = await Group.create({
      name,
      members: [...members, req.user._id],
      admin: req.user._id,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserGroups = async (req, res) => {
  const groups = await Group.find({
    members: req.user._id,
  }).populate("members", "fullName email profilePic");

  res.json(groups);
};

export const getGroupMembers = async (req, res) => {
  const group = await Group.findById(req.params.id).populate(
    "members",
    "fullName email profilePic"
  );

  res.json(group.members);
};
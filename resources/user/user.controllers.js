import { User } from "./user.model.js";

const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  res.json({ status: "ok", data: req.user });
};

const updateUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  const userID = req.user._id;
  try {
    const doc = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
    })
      .select("-password -identities")
      .lean()
      .exec();
    return res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Error performing the update" });
  }
};

export { getUserProfile, updateUserProfile };

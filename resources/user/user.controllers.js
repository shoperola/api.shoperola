const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  res.json(req.user);
};

const updateUserProfile = (req, res) => {};

export { getUserProfile, updateUserProfile };

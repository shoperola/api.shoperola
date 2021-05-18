const getUserProfile = (req, res) => {
  res.json(req.user);
};

const updateUserProfile = (req, res) => {};

export { getUserProfile, updateUserProfile };

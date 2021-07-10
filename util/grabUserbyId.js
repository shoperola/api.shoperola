import { User } from "../resources/user/user.model";

export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }
  const user = await User.findById(id);
  req.user = user;
  next();
};

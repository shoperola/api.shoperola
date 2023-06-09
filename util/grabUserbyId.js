import { User } from "../resources/user/user.model";
import {Admin} from "../resources/Admin website/admin-model";

export const getUserById = async (req, res, next) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: "ID required" });
  }
  const user = await User.findOne({ username });
  req.user = user;
  next();
};

export const getAdminById = async (req, res, next) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: "ID required" });
  }
  const admin = await Admin.findOne({ username });
  req.user = admin;
  next();
};

import mongoose from "mongoose";
import { Admin, generateUniqueUserName } from "./admin-model";
import { SECRETS } from "../../util/config";
const { Types } = mongoose;

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
  // console.log(req.file, req.body);

  const { username } = req.body;
  console.log(username);
  const updateObject = req.file
    ? {
        ...req.body,
        bannerImage: req.file.location,
        publicUrl: `${SECRETS.user_domain_url}/${
          username ? username : req.user.username
        }`,
      }
    : {
        ...req.body,
        publicUrl: `${SECRETS.user_domain_url}/${
          username ? username : req.user.username
        }`,
      };
  if (!updateObject) {
    return res.status(400).json({
      message: "Nothing to Update",
    });
  }
  try {
    const doc = await Admin.findByIdAndUpdate(userID, updateObject, {
      new: true,
    })
      .select("-password -identities")
      .lean()
      .exec();
    return res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e.message);
    if (e.message.includes("username_1 dup key")) {
      const newUsername = await generateUniqueUserName(
        username,
        req.user.firstName,
        req.user.lastName
      );
      return res.status(500).json({
        message: "Error updating username, username already exists",
        error: e.message,
        suggestion: newUsername,
      });
    }
    res
      .status(500)
      .send({ message: "Error performing the update", error: e.message });
  }
};

const deleteUser = async (req, res) => {
  const Model = req.model;
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  try {
    await Model.findOneAndDelete({ _id: req.user._id }).exec();
    res.json({ status: "ok", message: "User Deleted Successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error deleting User" });
  }
};

const changeUserPassword = async (req, res) => {
  const Modal = req.model;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const user = await Modal.findById(req.user._id).exec();
    const match = await user.checkPassword(oldPassword);
    if (!match) {
      return res.status(401).json({ message: "incorrect old password" });
    }
    const doc = await Modal.findByIdAndUpdate(req.user._id);
    if (doc) {
      doc.password = newPassword;
      await doc.save();
    }
    res.json({ status: "OK", message: "Password Changed Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Error fetching user object",
      error: e.message,
    });
  }
};

const getDashboardDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    // const videos = await Lesson.find({ madeBy: req.user._id });
    const products = await Ecommerce.find({ userID: req.user._id });
    const category = await Category.find({});

    // const subscribers = await Subscription.find({
    //   instructor: req.user._id,
    // });
    // const tvshows = await Tvshow.find({ user: req.user._id });
    res.json({
      status: "OK",
      data: {
        // videosCount: videos.length,
        //tvshowsCount: tvshows.length,
        productsCount: products.length,
        categoryCount: category.length,
        //subscriberCount: subscribers.length,
      },
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting details" });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  changeUserPassword,
  getDashboardDetails,
};

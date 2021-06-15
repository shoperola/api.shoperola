import { Payment, User, generateUniqueUserName } from "./user.model.js";
import { Request } from "../requests/requests.model.js";
import mongoose from "mongoose";
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
  const updateObject = req.file
    ? {
        ...req.body,
        bannerImage: req.file.location,
        publicUrl: `https://konsult-member.com/${username}`,
      }
    : { ...req.body, publicUrl: `https://konsult-member.com/${username}` };
  if (!updateObject) {
    return res.status(400).json({
      message: "Nothing to Update",
    });
  }
  try {
    const doc = await User.findByIdAndUpdate(userID, updateObject, {
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
      .status(400)
      .send({ message: "Error performing the update", error: e.message });
  }
};

const deleteUser = async (req, res) => {
  const Model = req.model;
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  try {
    const doc = await Model.findOneAndDelete({ _id: req.user._id }).exec();
    res.json({ status: "ok", message: "User Deleted Successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error deleting User" });
  }
};

const updateProfilePicture = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  const userID = req.user._id;
  console.log(req.file, req.body);
  try {
    const doc = await User.findByIdAndUpdate(
      userID,
      {
        picture: req.file.location,
      },
      {
        new: true,
      }
    )
      .select("-password -identities")
      .lean()
      .exec();
    res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error Updating Profile Picture" });
  }
  // res.json({ status: "recieved" });
};

const addFeatured = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  console.log(req.file);
  try {
    const doc = await User.findById(req.user._id);
    doc.featured.push({
      url: req.file.location,
    });
    await doc.save();
    res.json({ status: "OK", data: doc.featured });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error adding featured media", error: e.message });
  }
};

const updateFeatured = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  console.log(req.file);
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }
  try {
    const doc = await User.findOneAndUpdate(
      { "featured._id": id },
      {
        $set: {
          "featured.$.url": req.file.location,
        },
      },
      { new: true }
    );
    res.json({ status: "OK", data: doc.featured });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error updating featured media", error: e.message });
  }
};

const deleteFeatured = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }
  try {
    const doc = await User.findOneAndUpdate(
      { "featured._id": id },
      {
        $pull: { featured: { _id: id } },
      },
      { new: true }
    );
    res.json({ message: "Media removed successfully", data: doc.featured });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error deleting featured media", error: e.message });
  }
};

const addLanguage = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name needs to be provieded" });
  }
  try {
    const doc = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          languages: {
            name: name.toLowerCase(),
          },
        },
      },
      {
        new: true,
      }
    );
    res.json({ status: "OK", data: doc.languages });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error adding language", error: e.message });
  }
};

const deleteLanguage = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }
  try {
    const doc = await User.findOneAndUpdate(
      {
        "languages._id": id,
      },
      {
        $pull: { languages: { _id: id } },
      },
      {
        new: true,
      }
    );
    res.json({ status: "OK", data: doc.languages });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Error Deleting Language",
      error: e.message,
    });
  }
};

const addSubject = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  console.log(req.file);
  const subjectObject = req.file
    ? { ...req.body, banner: req.file.location }
    : { ...req.body };
  if (!subjectObject.name) {
    return res.status(400).json({ message: "Name of subject is required" });
  }

  try {
    const doc = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { subjects: subjectObject },
      },
      { new: true }
    );
    res.json({ status: "OK", data: doc.subjects });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error adding Subject", error: e.message });
  }
};

const updateSubject = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  const { name } = req.body;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }
  if (!name) {
    return res.status(400).json({ message: "Name not provided" });
  }

  console.log(req.file);
  const updateObject = req.file
    ? {
        "subjects.$.name": name.toLowerCase(),
        "subjects.$.banner": req.file.location,
      }
    : { "subjects.$.name": name.toLowerCase() };

  try {
    const doc = await User.findOneAndUpdate(
      { "subjects._id": id },
      {
        $set: updateObject,
      },
      { new: true }
    );
    res.json({ status: "OK", data: doc.subjects });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error updating the subject", error: e.message });
  }
};

const deleteSubject = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }

  try {
    const doc = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { subjects: { _id: id } },
      },
      { new: true }
    );
    res.json({ status: "OK", data: doc.subjects });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Error adding subject",
      error: e.message,
    });
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
    res.status(400).json({
      message: "Error fetching user object",
      error: e.message,
    });
  }
};

const updatePublicUrl = async (req, res) => {
  const { username } = req.body;
  try {
    const doc = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: username,
        publicUrl: `https://konsult-member.com/${username}`,
      },
      { new: true }
    );
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    const newUsername = await generateUniqueUserName(
      username,
      req.user.firstName,
      req.user.lastName
    );
    res.status(400).json({
      status: "Error",
      message: "Duplicate username already exists",
      suggestion: newUsername,
    });
  }
};

const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const doc = await User.findOne(
      { username: username },
      "-reviews -reviewsCount -views -totalEarnings -settings -rating -identities -email -password"
    ).exec();
    if (!doc) {
      throw new Error("No user found");
    }
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Error finding userData",
      error: e.message,
    });
  }
};

const getRequests = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  try {
    const doc = await Request.aggregate([
      {
        $match: {
          userID: req.user._id,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientID",
          foreignField: "_id",
          as: "requestedBy",
        },
      },
      {
        $unwind: "$requestedBy",
      },
      {
        $project: {
          client: {
            firstName: "$requestedBy.firstName",
            lastName: "$requestedBy.lastName",
          },
          status: 1,
          requestVideo: 1,
          answerVideo: 1,
          answerText: 1,
          clientID: 1,
          userID: 1,
          attachments: 1,
          requestText: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error getting requests" });
  }
};

const getRequest = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  const { id } = req.params;
  // console.log(id);
  if (!id) {
    return res.status(400).json({ message: "Empty id provided" });
  }
  try {
    const doc = await Request.aggregate([
      {
        $match: {
          _id: Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientID",
          foreignField: "_id",
          as: "requestedBy",
        },
      },
      {
        $unwind: "$requestedBy",
      },
      {
        $project: {
          client: {
            firstName: "$requestedBy.firstName",
            lastName: "$requestedBy.lastName",
          },
          status: 1,
          requestVideo: 1,
          answerVideo: 1,
          answerText: 1,
          clientID: 1,
          userID: 1,
          attachments: 1,
          requestText: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    const singleDoc = doc[0];
    if (!singleDoc) {
      return res.status(400).json({ status: "No request Found" });
    }
    res.json({ status: "ok", data: singleDoc });
  } catch (e) {
    console.log(e);
    if (
      e
        .toString()
        .includes(
          "Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        )
    ) {
      return res.status(400).json({ message: "Invalid request ID" });
    }
    res.status(400).json({ message: "Error getting requests" });
  }
};

const answerRequest = async (req, res) => {
  /**
   req.body = {
    answerText: "Here's the answer to your question"
   }
   req.params = { 
     id: ObjectID
   }
   **/
  console.log(req.file, req.body);
};

const getPaymentsAdded = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  try {
    const doc = await Payment.findOne({ userID: req.user._id });
    return res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error getting Payments" });
  }
};

const updatePaymentsInfo = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  const userID = req.user._id;
  try {
    const payments = await Payment.findOneAndUpdate({ userID }, req.body, {
      new: true,
    })
      .lean()
      .exec();
    res.json({ status: "ok", data: payments });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error getting Payments" });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  getPublicProfile,
  addFeatured,
  updateFeatured,
  deleteFeatured,
  addLanguage,
  deleteLanguage,
  deleteUser,
  addSubject,
  updateSubject,
  deleteSubject,
  getRequest,
  getRequests,
  answerRequest,
  getPaymentsAdded,
  updatePaymentsInfo,
  changeUserPassword,
  updatePublicUrl,
};

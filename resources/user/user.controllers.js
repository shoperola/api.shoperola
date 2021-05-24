import { User } from "./user.model.js";
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

export { getUserProfile, updateUserProfile, getRequest, getRequests };

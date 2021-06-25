import { Client } from "./client.model.js";
import { subscriberRelation } from "../subscriberUserRelation/subscriberUserRelation.model.js";

const getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    res.json({ status: "OK", data: client });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error finding client" });
  }
};

const createClient = async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ message: "Instructor ID not provided" });
  }
  const { sub, username, given_name, family_name, email } = req.user;
  let client;
  try {
    client = await Client.create({
      email: email,
      username: username,
      firstName: given_name,
      lastName: family_name,
      sub: sub,
    });
  } catch (e) {
    console.log(e.message);
    if (e.message.includes("E11000 duplicate key error collection")) {
      console.log("client already exists");
      client = await Client.findOne({ sub: sub });
    } else {
      return res.status(500).json({ message: "Error creating client" });
    }
  }
  // create Relation
  try {
    const relation = await subscriberRelation.create({
      subscriber: client._id,
      instructor: userID,
    });
    res.status(201).json({ status: "OK", data: client });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error creating relation" });
  }
};

export { getClient, createClient };

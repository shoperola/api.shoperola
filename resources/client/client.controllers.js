import { Client } from "./client.model";
import { User } from "../user/user.model";
import { Subscription } from "../subscription/subscription.model";
import { Cart } from "../Cart/cart_model";
import { Watchlist } from "../watchlist/watchlist_model";

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
    const cart = await Cart.create({});
    const watchlist = await Watchlist.create({});
    client = await Client.create({
      email: email,
      username: username,
      firstName: given_name,
      lastName: family_name,
      sub: sub,
      cartid: cart._id,
      watchlist: watchlist._id,
      ...req.body,
    });
  } catch (e) {
    console.log(e.message);
    if (e.message.includes("E11000 duplicate key error collection")) {
      console.log("client already exists");
      client = await Client.findOne({ sub: sub });
      await Cart.findByIdAndDelete(cart._id);
    } else {
      return res.status(500).json({ message: "Error creating client" });
    }
  }
  let user;
  try {
    user = await User.findById(userID);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error finding user" });
  }

  // create Relation
  try {
    const relation = await Subscription.create({
      subscriber: client._id,
      instructor: userID,
      amount: 0,
    });
    res.status(201).json({ status: "OK", data: client });
  } catch (e) {
    console.log(e.message);
    if (e.message.includes("E11000 duplicate key error collection")) {
      console.log("client already exists");
      res.status(200).json({ status: "OK", data: client });
    } else {
      res.status(500).json({ message: "Error creating relation" });
    }
  }
};

const suspendClient = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }
    const id = req.params.id;
    const client = await Client.findByIdAndUpdate(id, { status: false });
    res.json({ status: "OK", message: "Subscriber suspended" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error suspending subscription" });
  }
};

const resumeplay = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    const data = {
      vid: req.body.videoid,
      time: req.body.timeid,
    };
    const store = client.watchhistory.findIndex((x) => x.vid == data.vid);
    if (store === -1) {
      client.watchhistory.push(data);
    } else {
      client.watchhistory[store] = data;
    }
    const x = await client.save();
    res.send(x);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const continueplaying = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    const store = client.watchhistory.find((x) => x.vid == req.params.vid);
    if (store === -1) {
      res.send("error");
    } else {
      res.send(store.time);
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const resume_watching = async (req, res) => {
  try {
    const client = await Client.findOne({ sub: req.user.sub }).populate(
      "watchhistory.vid"
    );
    if (!client) {
      return res.status(400).json({ message: "User not Found" });
    }
    res.send(client).populate("lessons");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

export {
  getClient,
  createClient,
  suspendClient,
  resumeplay,
  continueplaying,
  resume_watching,
};

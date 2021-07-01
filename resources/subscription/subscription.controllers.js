import { Client } from "../client/client.model.js";
import { Subscription } from "../subscription/subscription.model.js";

const getSubscription = async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ message: "Required fields missing" });
  }
  let client;
  // get Client Details
  try {
    client = await Client.findOne({ sub: req.user.sub });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: "Error finding user" });
  }

  // get Subscription Details
  try {
    const subscription = await Subscription.findOne({
      subscriber: client._id,
      instructor: userID,
    }).populate({ path: "subscriber", select: "status" });
    console.log(subscription);
    res.json({ status: "OK", data: subscription });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error finding Subscription" });
  }
};

export { getSubscription };

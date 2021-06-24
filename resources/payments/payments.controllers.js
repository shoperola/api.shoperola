import { Payment } from "./payments.model.js";

const getPaymentsAdded = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  try {
    const doc = await Payment.findOne({ userID: req.user._id });
    return res.json({ status: "ok", data: doc });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error getting Payments" });
  }
};

const updatePaymentsInfo = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not Found" });
  }
  console.log(req.body);
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
    res.status(500).json({ message: "Error getting Payments" });
  }
};

export { getPaymentsAdded, updatePaymentsInfo };

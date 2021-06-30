import { PaymentLog } from "../paymentLog/paymentLog.model.js";
import { Transaction } from "./transactions.model.js";
import zeroDecimalCurrencies from "../../util/ZRC.js";

const processedByStripe = (logData) => {
  return logData.processed_by === "stripe";
};

const sessionCompleteEventListener = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const data = req.body;
  const paymentLogId =
    data.resource !== undefined
      ? data.resource.custom_id
      : data.data.object.metadata.custom_id;

  console.log(paymentLogId);
  if (!paymentLogId) {
    return res.status(400).json({ message: "custom_id Not found" });
  }
  let logData;
  // get MetaData from paymentlogs and check if its success is set to true. return if success === true
  try {
    logData = await PaymentLog.findById(paymentLogId).lean().exec();
    if (logData.success) {
      console.log(logData);
      return res.status(400).json({ message: "transaction already logged" });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: "Error getting metadata logs" });
  }

  //get MetaData from paymentlogs and mark it as success
  try {
    logData = await PaymentLog.findByIdAndUpdate(
      paymentLogId,
      {
        success: true,
      },
      { new: true }
    )
      .select("-updatedAt -_id -success")
      .lean()
      .exec();

    if (!logData) {
      throw new Error("No document matched");
    }
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "paymentLog Not Found", error: e.message });
  }

  console.log(logData);

  //create Transaction Payload to be inserted
  const transactionPayload = (() => {
    const currency = processedByStripe(logData)
      ? data.data.object.currency
      : data.resource.amount.currency_code;

    return {
      ...logData,
      confirmationID: processedByStripe(logData)
        ? data.data.object.id
        : data.resource.id,
      currency: currency,
      amount: processedByStripe(logData)
        ? currency.toUpperCase() in zeroDecimalCurrencies
          ? data.data.object.amount_total
          : data.data.object.amount_total / 100
        : data.resource.amount.value,
    };
  })();
  console.log(transactionPayload);
  // insert into transaction collection
  try {
    await Transaction.create(transactionPayload);
    res.json("Transaction Logged Successfully");
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Error inserting transaction data", error: e.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "client", select: "firstName lastName" });
    res.json({ status: "OK", data: transactions });
  } catch (e) {
    console.log(e.message);
    res
      .status(400)
      .json({ message: "Unable to fetch Transactions", e: e.message });
  }
};

export { sessionCompleteEventListener, getTransactions };

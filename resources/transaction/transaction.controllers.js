import { PaymentLog } from "../paymentLog/paymentLog.model.js";
import { Transaction } from "./transactions.model.js";
import zeroDecimalCurrencies from "../../util/ZRC.js";

const processedByStripe = (logData) => {
  return logData.processed_by === "stripe";
};

const sessionCompleteEventListener = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const data = req.body;
  const paymentLogId = data.resource
    ? data.resource.purchase_units[0].custom_id
    : data.data.object.metadata.custom_id;

  let logData;
  //get MetaData from paymentlogs and mark it as success
  try {
    logData = await PaymentLog.findByIdAndUpdate(
      paymentLogId,
      {
        success: true,
      },
      { new: true }
    )
      .select("-createdAt -updatedAt -_id -success")
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
      : data.resource.purchase_units.amount.currency_code;

    return {
      ...logData,
      confirmationID: processedByStripe(logData)
        ? data.data.object.id
        : data.resource.purchase_units.payments.captures.id,
      currency: currency,
      amount: processedByStripe(logData)
        ? currency.toUpperCase() in zeroDecimalCurrencies
          ? data.data.object.amount_total
          : data.data.object.amount_total / 100
        : data.resource.purchase_units.amount.value,
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

export { sessionCompleteEventListener };

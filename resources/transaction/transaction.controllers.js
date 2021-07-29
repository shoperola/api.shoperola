import { PaymentLog } from "../paymentLog/paymentLog.model";
import { Transaction } from "./transactions.model";
import { Subscription } from "../subscription/subscription.model";
import zeroDecimalCurrencies from "../../util/ZRC";
import {Orders} from "../orders/order_model";
import { Client } from "../client/client.model";

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
  const payment_type =  data.data.object.metadata.payment_type;
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
  const Orderpayload = (() => {
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
      status: "SUCCESS",
    };
  })();
  console.log(Orderpayload);
  // insert into transaction collection
  let transaction;
  console.log(payment_type);
  if(payment_type === "subscription"){
  try {
    transaction = await Transaction.create(Orderpayload);
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Error inserting transaction data", error: e.message });
  }


  //subscription as active

  try {
    console.log(transaction);
    const startDate = new Date(transaction.createdAt);
    const endDate =
      transaction.paymentType === "monthly"
        ? new Date(startDate.setMonth(startDate.getMonth() + 1))
        : new Date(startDate.setYear(startDate.getFullYear() + 1));
    // console.log(typeof endDate, endDate);
    const sub = await Subscription.findOneAndUpdate(
      {
        subscriber: transaction.client,
        instructor: transaction.user,
      },
      {
        amount: transaction.amount,
        subType: transaction.paymentType,
        subStart: transaction.createdAt,
        subEnd: endDate.toISOString(),
      }
    );
    console.log(sub);
    const client = await Client.findByIdAndUpdate(transaction.client, {
      status: true,
    });

    res.json({ message: "Transaction Logged Successfully" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error updating subscription" });
  }
}

else{
  const Orderpayload = (() => {
    const currency = data.resource.amount.currency_code;

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
      status: "SUCCESS",
    };
  })();
  console.log(Orderpayload);
  const order = await Order.create(Orderpayload)
  console.log(order);
  res.json({order});
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

const getTransactionById = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "OrderId not provided" });
  }
  try {
    const doc = await Transaction.findById(id).populate({
      path: "client",
      select: "firstName lastName",
    });
    if (!doc) {
      throw new Error("Transaction not found");
    }
    res.json({ status: "OK", data: doc });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting transaction" });
  }
};

export { sessionCompleteEventListener, getTransactions, getTransactionById };

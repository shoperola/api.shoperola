import { PaymentLog } from "../paymentLog/paymentLog.model";
import { Transaction } from "./transactions.model";
import {Orders} from "../orders/order_model";
import { Cart } from "../Cart/cart_model";

const sessionCompleteEventListener = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const {paymentLogId,currency,confirmationID,amount} = req.body;
  const payment_type ="Ecommerce";
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
  const TransactionPayload = (() => {
    return {
      ...logData,
      confirmationID: confirmationID,
      currency: currency,
      amount: amount/100,
      status: "SUCCESS",
    };
  })();
  console.log(TransactionPayload);
  // insert into transaction collection
  let transaction;
  const Orderpayload = (() => {
    return {
      ...logData,
      confirmationID: confirmationID,
      currency: currency,
      amount: amount / 100,
      status: "SUCCESS",
    };
  })();

  try {
    const order = await Orders.create(Orderpayload);
  const x = await order.populate('user').execPopulate();
  console.log(x);
  console.log(`asdfggh ${x.user.cartID}`);
  if(Orderpayload.status == 'SUCCESS'){
    console.log("iuoluoilul");
    order.is_completed = true;
    order.is_abandoned= false;
    // await order.save();
    const cart = await Cart.findByIdAndUpdate(x.user.cartID,{$set:{products: [],total_price :0}},{new: true});
    console.log(cart);
  }
  console.log(`remove successs!!!! ${order}`);

  res.status(200).json({status:"OK Transaction Completed"});
}catch(e){
  res.status(400).json({status:"Something wrong",error:e});
}

}

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
const transaction_status_create=async(req,res,next)=>{
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const createObject={...req.body,userID:req.user._id};
    const transaction= await Transaction.create(createObject);

    const order=await Orders.create({userID:req.user._id,is_completed:false,is_abandoned:false});
    if(transaction.status == 'SUCCESS'){
    order.is_completed = true;
    order.is_abandoned= false;
    await order.save();
    }else if(transaction.status=='FAILED' || transaction.status=='INITIATED'){
      order.is_completed = false;
      order.is_abandoned = true;
      await order.save();
    }
    res.status(201).json({ status: "OK", transaction_status: transaction,order_status:order });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting transaction" });
  }
}

const transaction_status_view = async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const _id=req.body;
    const transaction = await Transaction.findById(_id);
    res.status(200).json({ status: "OK", data: transaction });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting transaction" });
  }
};
const transaction_status_views = async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const transaction = await Transaction.find();
    res.status(200).json({ status: "OK", data: transaction });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error getting transaction" });
  }
};


export {
  sessionCompleteEventListener,
  getTransactions,
  getTransactionById,
  transaction_status_create,
  transaction_status_view,
  transaction_status_views
};

import { SECRETS } from "./config";
import Stripe from "stripe";
const stripe = new Stripe(SECRETS.stripeSecretKey);
import { User } from "../resources/user/user.model";
import { Client } from "../resources/client/client.model";
import { PaymentLog } from "../resources/paymentLog/paymentLog.model";
import zeroDecimalCurrencies from "./ZRC";
import { Payment } from "../resources/payments/payments.model";
import {Cart} from "../resources/Cart/cart_model"
import {Transaction} from "../resources/transaction/transactions.model";
import { Ecommerce } from "../resources/Ecommerce/ecomerce_model";
import {Address} from "../resources/Address/address_model";
import {Shipping} from "../resources/shipping_method/shipping_model";

const createAccount = async (user) =>
  await stripe.accounts.create({
    type: "standard",
    business_type: "individual",
    email: user.email,
    individual: {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    },
  });


const onBoardUser = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const userID = req.user._id;
    // console.log(userID);
    const paymentDoc = await Payment.findOne({ userID });
    let account;
    console.log(paymentDoc);
    if (!paymentDoc.stripe.id) {
      account = await createAccount(req.user);
      await Payment.findOneAndUpdate(
        { userID },
        {
          stripe: {
            id: account.id,
            details_submitted: false,
            charges_enabled: false,
          },
        }
      ).exec();
    } else {
      account = paymentDoc.stripe;
    }
    const id = account.id;
    console.log(account);
    const accountLink = await generateAccountLink(id);
    console.log(accountLink);
    res.json({ url: accountLink.url });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ message: "error onboarding user", error: e.message });
  }
};

const checkAccountStatus = async (req, res) => {
  if (!req.user) {
    return res.json({ message: "User Not Found" });
  }
  const userID = req.user._id;
  try {
    const account = await Payment.findOne({ userID });
    const accountID = account.stripe.id;
    const acc = await stripe.accounts.retrieve(accountID);
    console.log(acc);
    if (acc.details_submitted && acc.charges_enabled) {
      const doc = await Payment.findOneAndUpdate(
        { userID },
        {
          stripe: {
            id: accountID,
            details_submitted: true,
            charges_enabled: true,
          },
        },
        { new: true }
      )
        .lean()
        .exec();
      return res.json({ status: "success", data: doc });
    }
    res.json({ status: "Incomplete Details Submitted", data: account });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ message: "Error contacting stripe", error: e.message });
  }
};

const refreshAccountUrl = async (req, res) => {
  if (!req.user) {
    return res.json({ message: "User Not Found" });
  }
  try {
    // const { accountID } = req.session;
    const userID = req.user._id;
    const paymentDoc = await Payment.findOne({ userID });
    const { id: accountID } = paymentDoc.stripe;
    const accountLinkURL = await generateAccountLink(accountID);
    res.json({ url: accountLinkURL.url });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: e.message,
    });
  }
};

const generateAccountLink = async (id) =>
  await stripe.accountLinks.create({
    account: id,
    refresh_url: `${SECRETS.domain_url}/payment/stripe/refresh`,
    return_url: `${SECRETS.domain_url}/payment/stripe/return`,
    type: "account_onboarding",
  });

const createCheckoutSession = async (req, res) => {
  if (!req.user) {
    res.status(400).json({ message: "Client Not Found" });
  }

  let client;
  try {
    client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      throw new Error("Unable to find client");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: "Unable to find client" });
  }
  const clientID = client._id.toString();
  const { userID, paymentType } = req.body;
  if (!userID) {
    return res.status(400).json({
      data: { userID },
      message: "Required fields missing",
    });
  }
  // console.log("user: ", typeof userID, "client: ", typeof clientID);
  let user, sellerData, paymentDetails;
  try {
    user = await User.findById(userID).select("-password -identities");
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "Error finding seller", error: e.message });
  }
  console.log(user);
  if (!user.feesPerMonth && !user.feesPerYear) {
    return res.status(400).json({ message: "amount set to zero not allowed" });
  }

  try {
    sellerData = await Payment.findOne({ userID });
  } catch (e) {
    console.log(e.message);
    return res.json({
      message: "Error finding seller's payment info",
      error: e.message,
    });
  }
  console.log(sellerData);

  try {
    paymentDetails = await PaymentLog.create({
      client: clientID,
      user: userID,
      ip: req.ip,
      processed_by: "stripe",
      paymentType: paymentType,
    });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Error creating paymentDetails", error: e.message });
  }
  const item = {
    name: "Subsription",
    amount:
      user.settings.currency.toUpperCase() in zeroDecimalCurrencies
        ? paymentType === "monthly"
          ? user.feesPerMonth
          : user.feesPerYear
        : paymentType === "monthly"
        ? user.feesPerMonth * 100
        : user.feesPerYear * 100,
    currency: user.settings.currency,
    quantity: 1,
  };
  console.log(item);
  try {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [item],
        metadata: {
          custom_id: paymentDetails._id.toString(),
          payment_type: "subscription"
        },
        payment_intent_data: {
          application_fee_amount: 0,
        },
        mode: "payment",
        success_url: `${SECRETS.user_domain_url}/paymentDetails?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SECRETS.user_domain_url}/customer`,
      },
      {
        stripeAccount: sellerData.stripe.id,
      }
    );
    console.log(session);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: item.amount,
      currency: 'inr',
      payment_method_types: ['card'],
      description: "possibiliion"
    });
    return res.json({ id: session.id , paymentIntent});

    // console.log(await stripe.checkout.sessions.retrieve(session.id));
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Error occurred while creating checkout session",
      error: e.message,
    });

  }
//   try{
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: item.amount,
//     currency: 'inr',
//     payment_method_types: ['card'],
//     description: "possibiliion"
//   });
//   return res.json({paymentIntent, id: session.id});
// } catch (e) {
//   console.log(e.message);
//   res.status(400).json({
//     message: "Error occurred while generating paymentIntend",
//     error: e.message,
//   });
// }
};

const checkSessionStatusOnSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "Client Not Found" });
  }
  try {
    const { session_id, userID } = req.body;
    if (!session_id || !userID) {
      return res
        .status(400)
        .json({ message: "Session Id or userID not provided" });
    }
    console.log(req.body);

    const client = await Client.findOne({ sub: req.user.sub })
      .select("firstName lastName")
      .lean();
    if (!client) {
      throw new Error("Client not found");
    }

    const sellerData = await Payment.findOne({ userID });
    if (!sellerData) {
      throw new Error("Payment Details not found");
    }
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      stripeAccount: sellerData.stripe.id,
    });

    console.log(session);
    // const customer = await stripe.customers.retrieve(session.customer);
    return res.json({ status: "OK", data: { session, client } });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error finding session details", e: e.message });
  }
};

const cartCheckoutSession = async (req, res) => {
  if (!req.user) {
    res.status(400).json({ message: "Client Not Found" });
  }
  let client;
  try {
   client = await Client.findOne({ sub: req.user.sub });
    if (!client) {
      throw new Error("Unable to find client");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: "Unable to find client" });
  }
  const clientID = client._id.toString();
  const { userID} = req.body;
  if (!userID) {
    return res.status(400).json({
      data: { userID },
      message: "Required fields missing",
    });
  }
  // console.log("user: ", typeof userID, "client: ", typeof clientID);
  let user, sellerData, paymentDetails;
  try {
    user = await User.findById(userID).select("-password -identities");
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "Error finding seller", error: e.message });
  }
  //console.log(user);

  try {
    sellerData = await Payment.findOne({ userID });
  } catch (e) {
    console.log(e.message);
    return res.json({
      message: "Error finding seller's payment info",
      error: e.message,
    });
  }
 console.log(sellerData);
  const cart = await Cart.findById(client.cartid).populate({path:"products",populate: {
    path: 'pid'}});
  //console.log(JSON.stringify(cart, null, 4));
  let products_id = [];
  for(var i of cart.products){
    products_id.push(i.pid._id);
    //console.log(products);
  }
  //console.log(products_id);
  if(!cart || !cart.products.length) {
    return res.json({ message: "no cart available"});
  }
  const item = await cart.products.map(x => {
    return {
      name: x.pid.title,
      images: [x.pid.image],
      amount: "inr".toUpperCase() in zeroDecimalCurrencies?total_price:x.pid.total_price*100,
      quantity:x.quantity,
      currency: "inr"
     }
  })
  console.log(item);
  const address = await Address.findById(req.body.id);
  console.log(address);

  const shipment = await Shipping.find({$and:[
    {shipping_country:address.Country},
    {shipping_state:address.State}]});

console.log(`////////////////////////////////${parseInt(shipment[0].shipping_rate)} + ${parseInt(item.amount)}`);

  try {
    paymentDetails = await PaymentLog.create({
      client: clientID,
      user: userID,
      ip: req.ip,
      processed_by: "stripe",
      paymentType: "Ecommerce",
      products: products_id,
      amount: item.amount,
      address: address,
      shipment_rate: shipment[0].shipping_rate
    });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Error creating paymentDetails", error: e.message });
  }
  try {
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: item,
        metadata: {
          custom_id: paymentDetails._id.toString(),
          payment_type: "Ecommerce"
        },
        payment_intent_data: {
          application_fee_amount: 0,
        },
        mode: "payment",
        success_url: `${SECRETS.user_domain_url}/paymentDetails?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SECRETS.user_domain_url}/customer`,
      },
      {
        stripeAccount: sellerData.stripe.id,
      }
    );
    console.log(session);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.cart_total_price,
      currency: 'inr',
      payment_method_types: ['card'],
      description: "possibiliion"
    });
    return res.json({ id: session.id , paymentIntent});

    // console.log(await stripe.checkout.sessions.retrieve(session.id));
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Error occurred while creating checkout session",
      error: e.message,
    });

  }

};

const checkCartSessionStatusOnSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "Client Not Found" });
  }
  try {
    const { session_id, userID } = req.body;
    if (!session_id || !userID) {
      return res
        .status(400)
        .json({ message: "Session Id or userID not provided" });
    }
    console.log(req.body);

    const client = await Client.findOne({ sub: req.user.sub })
      .select("firstName lastName")
      .lean();
    if (!client) {
      throw new Error("Client not found");
    }

    const sellerData = await Payment.findOne({ userID });
    if (!sellerData) {
      throw new Error("Payment Details not found");
    }
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      stripeAccount: sellerData.stripe.id,
    });

    console.log(session);
    // const customer = await stripe.customers.retrieve(session.customer);
    return res.json({ status: "OK", data: { session, client } });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error finding session details", e: e.message });
  }
};

export {
  onBoardUser,
  refreshAccountUrl,
  createCheckoutSession,
  checkAccountStatus,
  checkSessionStatusOnSuccess,
  checkCartSessionStatusOnSuccess,
  cartCheckoutSession
  //paymentintend
};

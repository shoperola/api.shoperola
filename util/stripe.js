import { SECRETS } from "./config.js";
import * as stripe from "stripe";
const STRIPE = stripe(SECRETS.stripeSecretKey);
// console.log(STRIPE);
import { User } from "../resources/user/user.model.js";
import { Client } from "../resources/client/client.model.js";
import { PaymentLog } from "../resources/paymentLog/paymentLog.model.js";
import zeroDecimalCurrencies from "./ZRC.js";
import { Payment } from "../resources/payments/payments.model.js";

const createAccount = async (user) =>
  await STRIPE.accounts.create({
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
    const acc = await STRIPE.accounts.retrieve(accountID);
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
  await STRIPE.accountLinks.create({
    account: id,
    refresh_url: "https://kourse-53d4f.web.app/payment/stripe/refresh",
    return_url: "https://kourse-53d4f.web.app/payment/stripe/return",
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

  /*
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'T-shirt',
      },
      unit_amount: 2000,
    },
    quantity: 1,
  },
*/

  const item = {
    price_data: {
      currency: user.settings.currency,
      product_data: {
        name: "Subsription",
      },
      unit_amount:
        user.settings.currency.toUpperCase() in zeroDecimalCurrencies
          ? paymentType === "monthly"
            ? user.feesPerMonth
            : user.feesPerYear
          : paymentType === "monthly"
          ? user.feesPerMonth * 100
          : user.feesPerYear * 100,
    },
    quantity: 1,
  };
  console.log(item);

  // const item = {
  //   name: "Subsription",
  //   amount:
  //     user.settings.currency.toUpperCase() in zeroDecimalCurrencies
  //       ? paymentType === "monthly"
  //         ? user.feesPerMonth
  //         : user.feesPerYear
  //       : paymentType === "monthly"
  //       ? user.feesPerMonth * 100
  //       : user.feesPerYear * 100,
  //   currency: user.settings.currency,
  //   quantity: 1,
  // };
  // console.log(item);
  try {
    const session = await STRIPE.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [item],
        metadata: {
          custom_id: paymentDetails._id.toString(),
        },
        payment_intent_data: {
          application_fee_amount: 0,
        },
        mode: "payment",
        success_url:
          "https://kourse-53d4f.web.app/paymentDetails?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://kourse-53d4f.web.app/customer",
      },
      {
        stripeAccount: sellerData.stripe.id,
      }
    );
    console.log(session);
    console.log(await STRIPE.checkout.sessions.retrieve(session.id));
    res.json({ id: session.id });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
      message: "Error occurred while creating checkout session",
      error: e.message,
    });
  }
};

const checkSessionStatusOnSuccess = async (req, res) => {
  if (!req.user) {
    res.status(400).json({ message: "Client Not Found" });
  }
  try {
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: "Session Id not provided" });
    }
    console.log(req.body);
    console.log("EHLLLO");
    const session = await STRIPE.checkout.sessions.retrieve(session_id);
    console.log(session);
    const customer = await STRIPE.customers.retrieve(session.customer);
    return res.json({ status: "OK", data: { session, customer } });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error finding session details" });
  }
};

export {
  onBoardUser,
  refreshAccountUrl,
  createCheckoutSession,
  checkAccountStatus,
  checkSessionStatusOnSuccess,
};

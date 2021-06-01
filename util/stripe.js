import { SECRETS } from "./config.js";
import stripe from "stripe";
const STRIPE = new stripe(SECRETS.stripeSecretKey);
import { Payment } from "../resources/user/user.model.js";

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
    const { accountID } = req.session;
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
    refresh_url: "http://localhost:5500/refresh.html",
    return_url: "http://localhost:5500/return.html",
    type: "account_onboarding",
  });

const createCheckoutSession = async (req, res) => {
  try {
    const session = await STRIPE.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Web Dev Product",
            amount: 500,
            currency: "usd",
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: 10,
        },
        mode: "payment",
        success_url: "http://localhost:5500/success.html",
        cancel_url: "http://localhost:5500/cancel",
      },
      {
        stripeAccount: "acct_1Iw3HkSAllQxC9b5",
      }
    );
    console.log(session);
    res.json({ session: session });
  } catch (e) {
    console.log(e.message);
    res.json({
      message: "Error occurred while creating checkout session",
      error: e.message,
    });
  }
};

export {
  onBoardUser,
  refreshAccountUrl,
  createCheckoutSession,
  checkAccountStatus,
};

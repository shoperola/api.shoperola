import { SECRETS } from "./config.js";
import stripe from "stripe";
const STRIPE = new stripe(SECRETS.stripeSecretKey);
import { User, Payment } from "../resources/user/user.model.js";
import { PaymentLog } from "../resources/paymentLog/paymentLog.model.js";
import zeroDecimalCurrencies from "./ZRC.js";

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
    refresh_url: "https://kourse-53d4f.web.app/#/payment/stripe/refresh",
    return_url: "https://kourse-53d4f.web.app/#/payment/stripe/return",
    type: "account_onboarding",
  });

const createCheckoutSession = async (req, res) => {
  if (!req.user) {
    res.status(400).json({ message: "Client Not Found" });
  }
  const clientID = req.user._id.toString();
  const { userID } = req.body;
  const { appointment } = req.body;
  if (!appointment || !userID) {
    return res.status(400).json({
      data: { appointment, userID },
      message: "Required fields missing",
    });
  }
  console.log("user: ", typeof userID, "client: ", typeof clientID);
  console.log("appointment: ", typeof appointment);
  let user, sellerData, paymentDetails;
  try {
    user = await User.findById(userID).select("-password -identities");
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "Error finding seller", error: e.message });
  }
  console.log(user);
  if (!user.fees) {
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
      clientID: clientID,
      userID: userID,
      ip: req.ip,
      processed_by: "stripe",
      paid_by: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      appointment: appointment,
    });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Error creating paymentDetails", error: e.message });
  }

  try {
    const session = await STRIPE.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Appointment",
            amount:
              user.settings.currency.toUpperCase() in zeroDecimalCurrencies
                ? user.fees
                : user.fees * 100,
            currency: user.settings.currency,
            quantity: 1,
          },
        ],
        metadata: {
          custom_id: paymentDetails._id.toString(),
        },
        payment_intent_data: {
          application_fee_amount: 0,
        },
        mode: "payment",
        success_url: "http://localhost:5500/success.html",
        cancel_url: "http://localhost:5500/cancel",
      },
      {
        stripeAccount: sellerData.stripe.id,
      }
    );
    console.log(session);
    res.json({ id: session.id });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({
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

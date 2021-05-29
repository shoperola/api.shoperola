import { SECRETS } from "./config.js";
import stripe from "stripe";
const STRIPE = new stripe(SECRETS.stripeSecretKey);

const onBoardUser = async (req, res) => {
  try {
    const account = await STRIPE.accounts.create({
      type: "standard",
      // capabilities: ["card-payments", "transfers"],
    });
    const id = account.id;
    console.log(account);
    const accountLink = await STRIPE.accountLinks.create({
      account: id,
      refresh_url: "http://localhost:5500/refresh.html",
      return_url: "http://localhost:5500/return",
      type: "account_onboarding",
    });
    console.log(accountLink);
    res.json({ url: accountLink.url });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "error onboarding user" });
  }
};

const creatCheckoutSession = async (req, res) => {
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
};

export { onBoardUser, creatCheckoutSession };

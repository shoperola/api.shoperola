import axios from "axios";
import { SECRETS, PAYPAL_TOKEN, setPAYPAL_TOKEN } from "./config.js";
import { User, Payment } from "../resources/user/user.model.js";
import { PaymentLog } from "../resources/paymentLog/paymentLog.model.js";

const getAuthToken = async () => {
  try {
    const resp = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      {
        auth: {
          username: SECRETS.paypalClientKey,
          password: SECRETS.paypalClientSecret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(resp.data);
    setPAYPAL_TOKEN(resp.data.access_token);
  } catch (e) {
    console.log(e);
  }
};

const generateSignupLink = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  try {
    const resp = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
      {
        tracking_id: req.user._id,
        partner_config_override: {
          return_url:
            "http://mantur.s3-website-us-west-1.amazonaws.com/konsult-paypal",
          partner_logo_url:
            "https://shott.sfo3.digitaloceanspaces.com/logo_oJs-w8sDW.png",
        },
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
                third_party_details: {
                  features: ["PAYMENT", "REFUND"],
                },
              },
            },
          },
        ],
        products: ["EXPRESS_CHECKOUT"],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PAYPAL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(resp.data);
    return res.json(resp.data);
  } catch (e) {
    if (e.response && e.response.data.error === "invalid_token") {
      await getAuthToken();
      await generateSignupLink(req, res);
    } else {
      console.log(e.response.data);
      res.status(400).json({ message: "error contacting paypal" });
    }
  }
};

const createOrder = async (req, res) => {
  const userID = req.body.userID;
  // console.log(req.user);
  const clientID = req.user._id;
  const { appointment } = req.body;
  if (!appointment || !userID) {
    return res.status(400).json({
      data: { appointment, userID },
      message: "Required fields missing",
    });
  }
  let user, sellerData, paymentDetails;
  try {
    user = await User.findById(userID);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: "Error finding Merchant credentials" });
  }

  if (!user) {
    return res.status(400).json({ message: "Merchant not Found" });
  }

  try {
    sellerData = await Payment.findOne({ userID });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: "Seller Information Not Found", error: e.message });
  }
  console.log(userID, user, sellerData);

  try {
    paymentDetails = await PaymentLog.create({
      clientID: clientID,
      userID: userID,
      ip: req.ip,
      processed_by: "paypal",
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
    const order = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: user.settings.currency,
              value: user.fees,
            },
            payee: {
              merchant_id: sellerData.paypal.merchantIdInPayPal,
            },
            payment_instruction: {
              disbursement_mode: "INSTANT",
              platform_fees: [
                {
                  amount: {
                    currency_code: user.settings.currency,
                    value: "0.00",
                  },
                },
              ],
            },
            custom_id: paymentDetails._id,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYPAL_TOKEN}`,
          "PayPal-Partner-Attribution-Id": SECRETS.paypalBNCode,
        },
      }
    );
    console.log(order.data);
    res.json({
      orderID: order.data.id,
    });
  } catch (e) {
    if (e.response && e.response.data.error === "invalid_token") {
      await getAuthToken();
      await createOrder(req, res);
    } else {
      console.log(e.response.data || e.message);
      res.status(400).json({ message: "Error Creating Order" });
    }
  }
};

const captureOrder = async (req, res) => {
  const OrderID = req.params.id;
  try {
    const resp = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${OrderID}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYPAL_TOKEN}`,
          "PayPal-Partner-Attribution-Id": SECRETS.paypalBNCode,
        },
      }
    );
    console.log(resp);
    res.json({ status: "success" });
  } catch (e) {
    if (e.response && e.response.data.error === "invalid_token") {
      await getAuthToken();
      await captureOrder(req, res);
    } else {
      console.log(e.response.data);
      res.status(400).json({ message: "Error Capturing Order" });
    }
  }
};

export { getAuthToken, generateSignupLink, createOrder, captureOrder };

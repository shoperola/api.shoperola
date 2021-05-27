import axios from "axios";
import { SECRETS, PAYPAL_TOKEN, setPAYPAL_TOKEN } from "./config.js";

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
          return_url: "https://muleyashutosh.me",
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

// getAuthToken();
export { getAuthToken, generateSignupLink };

import { config } from "dotenv";
config();

const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
  paypalClientKey: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  paypalBNCode: process.env.PAYPAL_BN_CODE,
  stripePublishKey: process.env.STRIPE_PUBLISH_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  region: process.env.COGNITO_REGION,
  userPool: process.env.COGNITO_USERPOOL,
  clientId: process.env.COGNITO_CLIENT,
};

let PAYPAL_TOKEN = "";
const setPAYPAL_TOKEN = (token) => {
  PAYPAL_TOKEN = token;
};

export { SECRETS, PAYPAL_TOKEN, setPAYPAL_TOKEN };

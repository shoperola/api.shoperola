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
  paypalBaseUrl: process.env.PAYPAL_BASE_URL,
  stripePublishKey: process.env.STRIPE_PUBLISH_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  region: process.env.COGNITO_REGION,
  userPool: process.env.COGNITO_USERPOOL,
  clientId: process.env.COGNITO_CLIENT,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  auth_domain: process.env.COGNITO_AUTH_DOMAIN,
  redirect_uri: process.env.COGNITO_REDIRECT_URI,
  node_env: process.env.NODE_ENV,
  imDb_key: process.env.IMDB_API_KEY,
  domain_url: process.env.DOMAIN_URL,
  user_domain_url:process.env.USER_DOMAIN_URL,
  zero_tax_id : process.env.Zero_tax_id
};

let PAYPAL_TOKEN = "";
const setPAYPAL_TOKEN = (token) => {
  PAYPAL_TOKEN = token;
};

export { SECRETS, PAYPAL_TOKEN, setPAYPAL_TOKEN };

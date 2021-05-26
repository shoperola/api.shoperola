import { config } from "dotenv";
config();

export const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
  paypalClientKey: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
};

export let PAYPAL_TOKEN =
  "A21AALm6DI4r5N1vlMf7c7vgI8wVFLrnwvOUOE0GvPn1NwXnN8gzgawcH_LWOt9ZbwEq-jzqw13Nk9QOME5gbnGNnestEqcxw";
export const setPAYPAL_TOKEN = (token) => {
  PAYPAL_TOKEN = token;
};

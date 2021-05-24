import { config } from "dotenv";
config();

export const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
};

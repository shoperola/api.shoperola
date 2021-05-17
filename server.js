import express, { urlencoded, json } from "express";
import { signup, signin, protect } from "./util/auth.js";
import { connect } from "./util/db.js";
import morgan from "morgan";
import { config } from "dotenv";
config();
const app = express();
const port = process.env.PORT || 3000;

export const JWT_config = {
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "100d",
  },
};

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.post("/signup", signup);
app.post("/signin", signin);

export const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

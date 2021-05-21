import express, { urlencoded, json } from "express";
import { signup, signin, protect } from "./util/auth.js";
import { User } from "./resources/user/user.model.js";
import { Client } from "./resources/client/client.model.js";
import UserRouter from "./resources/user/user.router.js";
import RequestRouter from "./resources/requests/requests.router.js";
import { connect } from "./util/db.js";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";

config();
const app = express();
const port = process.env.PORT || 3000;

export const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
};

const userModel = (req, res, next) => {
  req.model = User;
  next();
};
const clientModel = (req, res, next) => {
  req.model = Client;
  next();
};

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.post("/signup", userModel, signup);
app.post("/signin", userModel, signin);
app.post("/signupClient", clientModel, signup);
app.post("/signinClient", clientModel, signin);
app.get("/", (req, res) => {
  res.json("Server is Running");
});
app.use("/api/user", userModel, protect, UserRouter);
app.use("/api/request", clientModel, protect, RequestRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

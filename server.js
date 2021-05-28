import express, { urlencoded, json } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import { signup, signin, protect } from "./util/auth.js";
import { User } from "./resources/user/user.model.js";
import { Client } from "./resources/client/client.model.js";
import UserRouter from "./resources/user/user.router.js";
import RequestRouter from "./resources/requests/requests.router.js";
import ClientRouter from "./resources/client/client.router.js";
import { connect } from "./util/db.js";

config();
const app = express();
const PORT = process.env.PORT || 3000;

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
app.use("/api/client", ClientRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

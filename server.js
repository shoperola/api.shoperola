import express, { urlencoded, json } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import expressListRoutes from "express-list-routes";
import { signup, signin, protect } from "./util/auth.js";
import { User } from "./resources/user/user.model.js";
import { Client } from "./resources/client/client.model.js";
import UserRouter from "./resources/user/user.router.js";
import RequestRouter from "./resources/requests/requests.router.js";
import ClientRouter from "./resources/client/client.router.js";
import TransactionRouter from "./resources/transaction/transaction.router.js";
import LessonRouter from "./resources/lesson/lesson.router.js";
import LanguageRouter from "./resources/language/language.router.js";
import { getPublicProfile as ProfileDataController } from "./resources/user/user.controllers.js";
import { connect } from "./util/db.js";
import { generateTokensfromCode, getVerifyMiddleware } from "./util/cognito.js";
import { SECRETS } from "./util/config.js";

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
app.use("/api/languages", LanguageRouter);
app.use("/api/user", userModel, protect, UserRouter);
app.get("/profile/:username", ProfileDataController);
app.use("/api/request", clientModel, protect, RequestRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/lesson", userModel, protect, LessonRouter);
app.post("/cognito/generateTokens", generateTokensfromCode);
app.use(
  "/api/client",
  async (req, res, next) => {
    (await getVerifyMiddleware())(req, res, next);
  },
  ClientRouter
);

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`REST API on http://localhost:${PORT}/`);
      if (SECRETS.node_env === "development") {
        expressListRoutes(app);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

// packages
import express, { urlencoded, json } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import expressListRoutes from "express-list-routes";
// modules
import { signup, signin, protect } from "./util/auth";
import { User } from "./resources/user/user.model";
import { Client } from "./resources/client/client.model";
import UserRouter from "./resources/user/user.router";
import RequestRouter from "./resources/requests/requests.router";
import ClientRouter from "./resources/client/client.router";
import TransactionRouter from "./resources/transaction/transaction.router";
import TvshowRouter from "./resources/tvshows/tvshow_routes";
import BannerRouter from "./resources/banners/banner_routes";
import LessonRouter from "./resources/lesson/lesson.router";
import CategoryRouter from "./resources/Category/Category_routes";
import StudioRouter from "./resources/Studio/studio_routes";
import CartRouter from "./resources/Cart/cart_routes";
import ProductRouter from "./resources/Ecommerce/ecommerce.router";
import LanguageRouter from "./resources/language/language.router";
import WatchlistRouter from "./resources/watchlist/watchlist_routes";
// import TvwatchlistRouter from "./resources/watchlist_tv/watchTv_routes";
import { getPublicProfile as ProfileDataController } from "./resources/user/user.controllers";
import { connect } from "./util/db";
import { generateTokensfromCode, getVerifyMiddleware } from "./util/cognito";
import { SECRETS } from "./util/config";
import { getUserById } from "./util/grabUserbyId";
import {
  getLessons,
  getLesson,
  trending,
} from "./resources/lesson/lesson.controllers";
import { viewbanner } from "./resources/banners/banner_controller";
import {
  tvShowTrending,
  viewall_tvshow,
} from "./resources/tvshows/tvshow_controller";
import { getProducts } from "./resources/Ecommerce/Ecommerce_controller";
import {
  view_tvshow,
  tvShowLatest,
} from "./resources/tvshows/tvshow_controller";
import { firebaseAuthProtect } from "./util/firebase";

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
const cognitoAuthMiddleware = await getVerifyMiddleware();
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
app.get("/tvshow/:username", getUserById, viewall_tvshow);
app.get("/tvshow/:username/:id", getUserById, view_tvshow);
app.get("/movies/:username", getUserById, getLessons);
app.get("/movie/:username/:id", getUserById, getLesson);
app.get("/banners/:username/", getUserById, viewbanner);
app.get("/products/:username/", getUserById, getProducts);
app.get("/latest/:username", getUserById, trending);
app.get("/latestTvShows/:username", getUserById, tvShowLatest);
app.get("/trendingTvShows/:username", getUserById, tvShowTrending);
app.use("/api/request", clientModel, protect, RequestRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/tvshow", userModel, protect, TvshowRouter);
app.use("/api/studio", userModel, protect, StudioRouter);
app.use("/api/lesson", userModel, protect, LessonRouter);
app.use("/api/cart", firebaseAuthProtect, CartRouter);
app.use("/api/category", userModel, protect, CategoryRouter);
app.use("/api/watchlist", firebaseAuthProtect, WatchlistRouter);
// app.use("/api/tvwatchlist", firebaseAuthProtect,TvwatchlistRouter);
app.use("/api/product", userModel, protect, ProductRouter);
app.use("/api/banner", userModel, protect, BannerRouter);
app.post("/cognito/generateTokens", generateTokensfromCode);
app.use("/api/client", firebaseAuthProtect, ClientRouter);
// app.post("/firebase/test/", firebaseAuthProtect, (req, res) => {
//   console.log("Recieved");
//   res.json("Success");
// });

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      if (SECRETS.node_env === "development") {
        expressListRoutes(app);
      }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

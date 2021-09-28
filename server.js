// packages
import express, { urlencoded, json } from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";
import expressListRoutes from "express-list-routes";
import { upload } from "./util/s3-spaces";

// modules
import { signup, signin, protect } from "./util/auth";
import { User } from "./resources/user/user.model";
import { Client } from "./resources/client/client.model";
import { Admin } from "./resources/Admin website/admin-model";
import UserRouter from "./resources/user/user.router";
import TextRouter from "./resources/ConfigText/text.router";
import RequestRouter from "./resources/requests/requests.router";
import ClientRouter from "./resources/client/client.router";
import TransactionRouter from "./resources/transaction/transaction.router";
import TvshowRouter from "./resources/tvshows/tvshow_routes";
import BannerRouter from "./resources/banners/banner_routes";
import LessonRouter from "./resources/lesson/lesson.router";
import CategoryRouter from "./resources/Category/Category_routes";
import TaxRouter from "./resources/tax_rates/tax_route";
import StudioRouter from "./resources/Studio/studio_routes";
import CartRouter from "./resources/Cart/cart_routes";
import CategoriesRouter from "./resources/Content_category/Content_category_routes";
import ProductRouter from "./resources/Ecommerce/ecommerce.router";
import AdminRouter from "./resources/Admin website/Admin-router";
import LanguageRouter from "./resources/language/language.router";
import WatchlistRouter from "./resources/watchlist/watchlist_routes";
import { view_social } from "./resources/Admin website/Social_footer/social_controller";
import { view_logo } from "./resources/Admin website/Logo/logo_contoller";
import { view_link } from "./resources/Admin website/Link/link_controller";
import { view_home_setting } from "./resources/Admin website/home srtting page/home_setting_controller";
import { view_AdminAddress } from "./resources/Admin website/Address_footer/address_controller";
import {
  view_contact,
  add_contact,
  view_contact_id,
} from "./resources/Admin website/contact_us/contact_us_controller";
import {
  view_Demo,
  add_demo,
  view_Demo_id,
} from "./resources/Admin website/demo/demo_controller";
// import TvwatchlistRouter from "./resources/watchlist_tv/watchTv_routes";
import { getPublicProfile as ProfileDataController } from "./resources/user/user.controllers";
import { connect } from "./util/db";
//import { generateTokensfromCode, getVerifyMiddleware } from "./util/cognito";
import { SECRETS } from "./util/config";
import AddressRouter from "./resources/Address/address_routes";
import AddressUserRouter from "./resources/ConfigAddress/address_router";
import SocialRouter from "./resources/ConfigSocial/social_router";
import AppsRouter from "./resources/ConfigApps/apps_router";
import OrderRouter from "./resources/orders/order_router";
import CouponRouter from "./resources/Coupons/coupon_router";
import { getUserById, getAdminById } from "./util/grabUserbyId";
import {
  getLessons,
  getLesson,
  trending,
  //search_movies,
} from "./resources/lesson/lesson.controllers";
import { viewbanner } from "./resources/banners/banner_controller";
import {
  tvShowTrending,
  viewall_tvshow,
  search_tvshow,
  view_tvshow,
  tvShowLatest,
} from "./resources/tvshows/tvshow_controller";
import {
  getProducts,
  getProductById,
  getproducy_by_category,
} from "./resources/Ecommerce/Ecommerce_controller";
import { firebaseAuthProtect } from "./util/firebase";
import { view as viewCategories } from "./resources/Category/Category_controller";
import {
  add_news,
  view_news,
} from "./resources/Admin website/newsletter/newsletter_contoller";
import feautreRouter from "./resources/featured_products/featured_routes";
import { view_featured_products } from "./resources/featured_products/featured_controller";
import { add_tax_zero } from "./resources/tax_rates/tax_controller";
import ShippmentRouter from "./resources/shipping_method/shipping_route";
import { zero_shipping_rate } from "./resources/shipping_method/shipping_controller";
import { view_amount } from "./resources/paymentLog/payment_log_controller";
import { public_shipments } from "./resources/shipping_method/shipping_controller";
import EmailRouter from "./resources/Email templates/email_router";
import {get_product_by_price} from "./resources/Cart/cart_contoller";
import {getcoupons_client} from "./resources/Coupons/coupon_controller";
import VariantRouter from "./resources/variants/variant_router";
import {getall_users} from "./resources/user/user.controllers";

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

const adminModel = (req, res, next) => {
  req.model = Admin;
  next();
};
//const cognitoAuthMiddleware = await getVerifyMiddleware();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.post("/signup", userModel, signup);
app.post("/signin", userModel, signin);
app.post("/signup_admin", adminModel, signup);
app.post("/sigin_admin", adminModel, signin);
app.post("/signupClient", clientModel, signup);
app.post("/signinClient", clientModel, signin);
app.get("/", (req, res) => {
  res.json("Server is Running");
});
app.use("/api/product",userModel,protect,VariantRouter)
app.use("/api/user", userModel, protect, TextRouter);
app.get("/admin_users", getall_users);
app.use("/api/user", userModel, protect, AddressUserRouter);
app.use("/api/user", userModel, protect, SocialRouter);
app.use("/api/user", userModel, protect, AppsRouter);
app.use("/api/user", userModel, protect, OrderRouter);

app.use("/api/languages", LanguageRouter);
app.use("/api/user", userModel, protect, UserRouter);
app.get("/profile/:username", ProfileDataController);
app.get("/tvshow/:username", getUserById, viewall_tvshow);
app.use("/admin", adminModel, protect, AdminRouter);
app.get("/tvshow/:username/:id", getUserById, view_tvshow);
app.get("/movies/:username", getUserById, getLessons);
app.get("/movie/:username/:id", getUserById, getLesson);
app.get("/banners/:username/", getUserById, viewbanner);
app.get("/products/:username/", getUserById, getProducts);
app.get(
  "/category_products/:username/:id",
  getUserById,
  getproducy_by_category
);
app.get("/view_social", view_social);
app.get("/view_home_setting", view_home_setting);
app.get("/view_link", view_link);
app.get("/view_admin_address", view_AdminAddress);
app.get("/view_admin_logo", view_logo);
app.get("/view_contact", view_contact);
app.post("/add_contact", add_contact);
app.get("/view_contact_id/:id", view_contact_id);
app.post("/add_demo", add_demo);
app.get("/view_demo", view_Demo);
app.get("/view_demo_id/:id", view_Demo_id);
app.post("/add_news", add_news);
app.get("/view_news", view_news);
app.post("/add_zero", add_tax_zero);
app.get("/view_amount/:id", view_amount);
app.post("/add_zero_shippingRate", zero_shipping_rate);
app.get("/shipments/:id", public_shipments);
app.get("/view_coupons", firebaseAuthProtect, getcoupons_client);
app.get("/products/:username/:id", getUserById, getProductById);
app.get("/latest/:username", getUserById, trending);
app.get("/latestTvShows/:username", getUserById, tvShowLatest);
app.get("/trendingTvShows/:username", getUserById, tvShowTrending);
app.get("/categories/:username", getUserById, viewCategories);
app.get("/view_featured/:username", getUserById, view_featured_products);
//app.get("/search_movie/:username/:name", getUserById, search_movies);
app.get("/search_tvshow/:username/:name", getUserById, search_tvshow);
app.use("/api/request", clientModel, protect, RequestRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/tvshow", userModel, protect, TvshowRouter);
app.use("/api/studio", userModel, protect, StudioRouter);
app.use("/api/lesson", userModel, protect, LessonRouter);
app.post("/get_orders_overPrice", get_product_by_price);

app.use("/api/sendEmail", userModel, protect, EmailRouter);
app.use("/api/categories", userModel, protect, CategoriesRouter);
app.use("/api/cart", firebaseAuthProtect, CartRouter);
app.use("/api/category", userModel, protect, CategoryRouter);
app.use("/api/coupons", userModel, protect, CouponRouter);
app.use("/api/watchlist", firebaseAuthProtect, WatchlistRouter);
// app.use("/api/tvwatchlist", firebaseAuthProtect,TvwatchlistRouter);
app.use("/api/product", userModel, protect, ProductRouter);
app.get("/testing/:id", userModel, protect, view_amount);
app.use("/api/feature_product", userModel, protect, feautreRouter);
app.use("/api/tax_rates", userModel, protect, TaxRouter);
app.use("/api/shipment", userModel, protect, ShippmentRouter);

app.use("/api/banner", userModel, protect, BannerRouter);
//app.post("/cognito/generateTokens", generateTokensfromCode);
app.use("/api/address", firebaseAuthProtect, AddressRouter);
app.use("/api/client", firebaseAuthProtect, ClientRouter);
// app.post("/firebase/test/", firebaseAuthProtect, (req, res) => {
//   console.log("Recieved");
//   res.json("Success");
// });

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      // if (SECRETS.node_env === "development") {
      //   expressListRoutes(app);
      // }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

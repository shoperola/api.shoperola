import { Router } from "express";
import { createOrder, captureOrder } from "../../util/paypal";
import {
  checkSessionStatusOnSuccess,
  createCheckoutSession,
  checkCartSessionStatusOnSuccess,
  cartCheckoutSession
 // paymentintend
} from "../../util/stripe";
import { renewToken } from "../../util/cognito";
import {  show_order, order_by_id,update_address } from "../paymentLog/order_controller";
import {
  createClient,
  getClient,
  resumeplay,
  continueplaying,
  resume_watching,
} from "./client.controllers";
import { getSubscription,getSubscriptionById } from "../subscription/subscription.controllers";
import { view_list, view_listbyid } from "../Studio/studio_contoller";
import {
  //search_movies,
  videosViewsIncrement,
} from "../lesson/lesson.controllers";
import {
  tvShowsViewsIncrement,
  search_tvshow,
} from "../tvshows/tvshow_controller";
import {view_amount} from "../paymentLog/payment_log_controller";

const router = Router();
router.get("/view_order/:id",order_by_id);
router.get("/view_orders", show_order);
router.get("/view_logs", view_amount);
router.patch("/update_address_order/:id", update_address);
router.route("/").get(getClient).post(createClient);
router.route("/refreshToken").post(renewToken);

router.route("/subscription").post(getSubscription);
router.get("/getsubscription/:id", getSubscriptionById);

router.route("/paypal/create-order").post(createOrder);
router.route("/stripe/create-checkout-session").post(createCheckoutSession);
router.route("/paypal/capture-order").post(captureOrder);
router
  .route("/stripe/check-checkout-session")
  .post(checkSessionStatusOnSuccess);
//router.post("/stripe/paymentintend", paymentintend);
router.route("/stripe/create-cart-checkout-session").post(cartCheckoutSession);
router.route("/stripe/check-cart-checkout-session").post(checkCartSessionStatusOnSuccess);

router.post("/studio/", view_list);
router.get("/studio/:id", view_listbyid);
router.post("/resumeplay", resumeplay);
router.get("/get_time/:vid", continueplaying);
router.get("/view_continue", resume_watching);
router.post("/videos/increment/:id", videosViewsIncrement);
router.post("/tvshow/increment/:id", tvShowsViewsIncrement);

export default router;

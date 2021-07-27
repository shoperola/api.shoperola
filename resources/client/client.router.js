import { Router } from "express";
import { createOrder, captureOrder } from "../../util/paypal";
import {
  checkSessionStatusOnSuccess,
  createCheckoutSession,
  paymentintend
} from "../../util/stripe";
import { renewToken } from "../../util/cognito";
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

const router = Router();
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
router.post("/stripe/paymentintend", paymentintend);

router.post("/studio/", view_list);
router.get("/studio/:id", view_listbyid);
router.post("/resumeplay", resumeplay);
router.get("/get_time/:vid", continueplaying);
router.get("/view_continue", resume_watching);
router.post("/videos/increment/:id", videosViewsIncrement);
router.post("/tvshow/increment/:id", tvShowsViewsIncrement);

export default router;

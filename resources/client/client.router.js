import { Router } from "express";
import { createOrder, captureOrder } from "../../util/paypal";
import {
  checkSessionStatusOnSuccess,
  createCheckoutSession,
} from "../../util/stripe";
import { renewToken } from "../../util/cognito";
import { createClient, getClient } from "./client.controllers";
import { getSubscription } from "../subscription/subscription.controllers";
import { view_list, view_listbyid } from "../Studio/studio_contoller";

const router = Router();
router.route("/").get(getClient).post(createClient);
router.route("/refreshToken").post(renewToken);

router.route("/subscription").post(getSubscription);

router.route("/paypal/create-order").post(createOrder);
router.route("/paypal/capture-order/:id").post(captureOrder);
router.route("/stripe/create-checkout-session").post(createCheckoutSession);
router
  .route("/stripe/check-checkout-session")
  .post(checkSessionStatusOnSuccess);

router.post("/studio/", view_list);
router.post("/studio/:id", view_listbyid);

export default router;

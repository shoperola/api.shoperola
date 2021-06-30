import { Router } from "express";
import { createOrder, captureOrder } from "../../util/paypal.js";
import { createCheckoutSession } from "../../util/stripe.js";
import { renewToken } from "../../util/cognito.js";
import { createClient, getClient } from "./client.controllers.js";
import { getSubscription } from "../subscription/subscription.controllers.js";

const router = Router();
router.route("/").get(getClient).post(createClient);
router.route("/refreshToken").post(renewToken);

router.route("/subscription").get(getSubscription);

router.route("/paypal/create-order").post(createOrder);
router.route("/paypal/capture-order/:id").post(captureOrder);
router.route("/stripe/create-checkout-session").post(createCheckoutSession);

export default router;

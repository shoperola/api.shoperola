import { createOrder, captureOrder } from "../../util/paypal.js";
import { createCheckoutSession } from "../../util/stripe.js";
import { Router } from "express";

const router = Router();
router.route("/").get(() => {
  res.send(
    "Successfully verified JWT token. Extracted information: " +
      JSON.stringify(req.user)
  );
});
router.route("/paypal/create-order").post(createOrder);
router.route("/paypal/capture-order/:id").post(captureOrder);
router.route("/stripe/create-checkout-session").post(createCheckoutSession);

export default router;

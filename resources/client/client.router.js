import { Router } from "express";
import { createOrder, captureOrder } from "../../util/paypal";
import {
  checkSessionStatusOnSuccess,
  createCheckoutSession,
  checkCartSessionStatusOnSuccess,
  cartCheckoutSession,
  // paymentintend
} from "../../util/stripe";
import {view_order } from "../paymentLog/order_controller";
import {cartEmpty} from "../Cart/cart_contoller"
const router = Router();
// router.get("/view_order/:id",order_by_id);
// router.get("/view_orders", show_order);
// router.patch("/update_address_order/:id", update_address);
// router.route("/").get(getClient).post(createClient);
// router.route("/refreshToken").post(renewToken);

// router.route("/subscription").post(getSubscription);
// router.get("/getsubscription/:id", getSubscriptionById);

// router.route("/paypal/create-order").post(createOrder);
// router.route("/paypal/capture-order").post(captureOrder);
// router.post("/stripe/paymentintend", paymentintend);


// router.route("/stripe/create-checkout-session").post(createCheckoutSession);
// router
//   .route("/stripe/check-checkout-session")
//   .post(checkSessionStatusOnSuccess);
router.route("/stripe/create-cart-checkout-session").post(cartCheckoutSession);
router
  .route("/stripe/check-cart-checkout-session")
  .post(checkCartSessionStatusOnSuccess);

router.route("/check_order_completed").get(view_order);
router.route("/cart_session_expired").put(cartEmpty);

export default router;

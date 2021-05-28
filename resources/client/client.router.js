import { createOrder, captureOrder } from "../../util/paypal.js";
import { Router } from "express";

const router = Router();

router.route("/paypal/create-order").post(createOrder);
router.route("/paypal/capture-order/:id").post(captureOrder);

export default router;

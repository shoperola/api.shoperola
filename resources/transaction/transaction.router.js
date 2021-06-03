import { sessionCompleteEventListener } from "../../util/stripe.js";
import { Router } from "express";

const router = Router();

router.route("/").post(sessionCompleteEventListener);

export default router;

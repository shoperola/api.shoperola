import { Router } from "express";
import { generateSignupLink } from "../../util/paypal.js";
import { upload } from "../../util/s3-spaces.js";
import {
  onBoardUser,
  createCheckoutSession,
  refreshAccountUrl,
  checkAccountStatus,
} from "../../util/stripe.js";
import {
  getRequest,
  getRequests,
  answerRequest,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  deleteUser,
  getPaymentsAdded,
  updatePaymentsInfo,
} from "./user.controllers.js";

const router = Router();

router.route("/").get(getUserProfile).put(updateUserProfile).delete(deleteUser);
router.route("/payments").get(getPaymentsAdded).put(updatePaymentsInfo);
router.route("/profile").put(upload.single("picture"), updateProfilePicture);
router.route("/requests").get(getRequests);
router.route("/request/:id").get(getRequest);
router.route("/request/answer/:id").get(answerRequest);
router.route("/paypal/getActionUrl").get(generateSignupLink);
router.route("/stripe/onboard-user").get(onBoardUser);
router.route("/stripe/onboard-user/refresh").get(refreshAccountUrl);
router.route("/stripe/checkAccountStatus").get(checkAccountStatus);
router.route("/stripe/create-checkout-session").get(createCheckoutSession);

export default router;

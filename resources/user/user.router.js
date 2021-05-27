import { Router } from "express";
import { generateSignupLink } from "../../util/paypal.js";
import { upload } from "../../util/s3-spaces.js";
import {
  getRequest,
  getRequests,
  answerRequest,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  deleteUser,
  getPaymentsAdded,
} from "./user.controllers.js";
const router = Router();

router.route("/").get(getUserProfile).put(updateUserProfile).delete(deleteUser);
router.route("/payments").get(getPaymentsAdded);
router.route("/profile").put(upload.single("picture"), updateProfilePicture);
router.route("/requests").get(getRequests);
router.route("/request/:id").get(getRequest);
router.route("/request/answer/:id").get(answerRequest);
router.route("/paypal/getActionUrl").get(generateSignupLink);

export default router;
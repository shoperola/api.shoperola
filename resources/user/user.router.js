import { Router } from "express";
import { generateSignupLink } from "../../util/paypal.js";
import { upload } from "../../util/s3-spaces.js";
import {
  getRequest,
  getRequests,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  answerRequest,
} from "./user.controllers.js";
const router = Router();

router.route("/").get(getUserProfile).put(updateUserProfile);
router.route("/profile").put(upload.single("picture"), updateProfilePicture);
router.route("/requests").get(getRequests);
router.route("/request/:id").get(getRequest);
router.route("/request/answer/:id").get(answerRequest);
router.route("/paypal/getActionUrl").get(generateSignupLink);

export default router;

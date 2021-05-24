import { Router } from "express";
import { upload } from "../../util/s3-spaces.js";
import {
  getRequest,
  getRequests,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
} from "./user.controllers.js";
const router = Router();

router.route("/").get(getUserProfile).put(updateUserProfile);
router.route("/profile").put(upload.single("picture"), updateProfilePicture);
router.route("/requests").get(getRequests);
router.route("/request/:id").get(getRequest);

export default router;

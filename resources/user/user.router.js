import { Router } from "express";
import {
  getRequest,
  getRequests,
  getUserProfile,
  updateUserProfile,
} from "./user.controllers.js";
const router = Router();
router.route("/").get(getUserProfile).put(updateUserProfile);

router.route("/requests").get(getRequests);
router.route("/request/:id").get(getRequest);
export default router;

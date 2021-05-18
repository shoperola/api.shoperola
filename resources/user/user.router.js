import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./user.controllers.js";
const router = Router();
router.route("/").get(getUserProfile).put(updateUserProfile);

export default router;

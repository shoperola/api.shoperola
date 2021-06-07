import { sessionCompleteEventListener } from "./transaction.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/").post(sessionCompleteEventListener);

export default router;

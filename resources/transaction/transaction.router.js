import {
  sessionCompleteEventListener,
  getTransactions,
} from "./transaction.controllers";
import { Router } from "express";

const router = Router();

router.route("/").post(sessionCompleteEventListener);

export default router;

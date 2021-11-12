import {
  sessionCompleteEventListener,
  getTransactions,
  transaction_status_create,
  transaction_status_view
} from "./transaction.controllers";
import { Router } from "express";

const router = Router();

// router.route("/").post(sessionCompleteEventListener);
router.route("/status/create").post(transaction_status_create);
router.route("/status/get").get(transaction_status_view)
export default router;

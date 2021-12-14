import {
  sessionCompleteEventListener,
  getTransactions,
  transaction_status_create,
  transaction_status_view,
  transaction_status_views

} from "./transaction.controllers";
import { Router } from "express";

const router = Router();

// router.route("/").post(sessionCompleteEventListener);
router.route("/status/create").post(transaction_status_create);
router.route("/status/get").get(transaction_status_view);
router.route("/statuses").get(transaction_status_views);

export default router;

// /api/transaction/statuses
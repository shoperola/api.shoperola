import { Router } from "express";
import { generateSignupLink } from "../../util/paypal";
import { upload } from "../../util/s3-spaces";
import {
  onBoardUser,
  refreshAccountUrl,
  checkAccountStatus,
} from "../../util/stripe";
import {
  getRequest,
  getRequests,
  answerRequest,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  addFeatured,
  updateFeatured,
  deleteFeatured,
  changeUserPassword,
  deleteUser,
  updatePublicUrl,
  addLanguage,
  deleteLanguage,
  addSubject,
  deleteSubject,
  updateSubject,
  getSubject,
  getSubscribers,
  getDashboardDetails,
} from "./user.controllers";
import {
  getTransactionById,
  getTransactions,
} from "../../resources/transaction/transaction.controllers";
import {
  getPaymentsAdded,
  updatePaymentsInfo,
} from "../../resources/payments/payments.controllers";
import { suspendClient } from "../client/client.controllers";
import { getSubscriptionById } from "../subscription/subscription.controllers";

const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .put(upload.single("bannerImage"), updateUserProfile)
  .delete(deleteUser);

router.route("/payments").get(getPaymentsAdded).put(updatePaymentsInfo);

router.route("/profile").put(upload.single("picture"), updateProfilePicture);

router.route("/profile/username").put(updatePublicUrl);

router.route("/featured").post(upload.single("featured"), addFeatured);

router
  .route("/featured/:id")
  .put(upload.single("featured"), updateFeatured)
  .delete(deleteFeatured);

router.route("/languages/").post(addLanguage);

router.route("/languages/:id").delete(deleteLanguage);

router.route("/subjects/").post(upload.single("banner"), addSubject);

router
  .route("/subjects/:id")
  .get(getSubject)
  .put(upload.single("banner"), updateSubject)
  .delete(deleteSubject);

router.route("/subscribers").get(getSubscribers);

router.route("/subscriber/:id").get(getSubscriptionById);

router.route("/subscribers/suspend/:id").patch(suspendClient);

router.route("/requests").get(getRequests);

router.route("/password").post(changeUserPassword);

router.route("/request/:id").get(getRequest);

router.route("/request/answer/:id").get(answerRequest);

router.route("/paypal/getActionUrl").get(generateSignupLink);

router.route("/stripe/onboard-user").get(onBoardUser);

router.route("/stripe/onboard-user/refresh").get(refreshAccountUrl);

router.route("/stripe/checkAccountStatus").get(checkAccountStatus);

router.route("/transaction/").get(getTransactions);

router.route("/transaction/:id").get(getTransactionById);

router.get("/details", getDashboardDetails);

export default router;

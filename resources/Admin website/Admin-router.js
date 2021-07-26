import { Router } from "express";
import { upload } from "../../util/s3-spaces";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getDashboardDetails,
} from "./admin-contoller";

const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .put(upload.single("bannerImage"), updateUserProfile)
  .delete(deleteUser);

//router.route("/profile").put(upload.single("picture"), updateProfilePicture);

//router.route("/profile/username").put(updatePublicUrl);

//router.route("/featured").post(upload.single("featured"), addFeatured);

// router
//   .route("/featured/:id")
//   .put(upload.single("featured"), updateFeatured)
//   .delete(deleteFeatured);

// router.route("/languages/").post(addLanguage);

// router.route("/languages/:id").delete(deleteLanguage);

// router.route("/subjects/").post(upload.single("banner"), addSubject);

// router
//   .route("/subjects/:id")
//   .get(getSubject)
//   .put(upload.single("banner"), updateSubject)
//   .delete(deleteSubject);

// router.route("/subscribers").get(getSubscribers);

// router.route("/subscriber/:id").get(getSubscriptionById);

// router.route("/subscribers/suspend/:id").patch(suspendClient);

// router.route("/requests").get(getRequests);

router.route("/password").post(changeUserPassword);

// router.route("/request/:id").get(getRequest);

// router.route("/request/answer/:id").get(answerRequest);

// router.route("/paypal/getActionUrl").get(generateSignupLink);

// router.route("/stripe/onboard-user").get(onBoardUser);

// router.route("/stripe/onboard-user/refresh").get(refreshAccountUrl);

// router.route("/stripe/checkAccountStatus").get(checkAccountStatus);

// router.route("/transaction/").get(getTransactions);

// router.route("/transaction/:id").get(getTransactionById);

router.get("/details", getDashboardDetails);

export default router;

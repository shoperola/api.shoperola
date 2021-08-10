import { Router } from "express";
import { upload } from "../../util/s3-spaces";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getDashboardDetails,
} from "./admin-contoller";
import {social_add, social_update, social_delete} from "./Social_footer/social_controller";
import {add_logo,update_logo,delete_logo} from "./Logo/logo_contoller";
import  {add_link, update_link,delete_link} from "./Link/link_controller";
import  {add_home_setting,view_id_home_setting, update_home_setting, delete_home_setting} from "./home srtting page/home_setting_controller";
import {add_AdminAddress, update_AdminAddress,delete_AdminAddress} from "./Address_footer/address_controller";
import {add_contact, update_contact, delete_contact} from "./contact_us/contact_us_controller";
import {add_demo,update_Demo, delete_Demo} from "./demo/demo_controller";
const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .put(upload.single("bannerImage"), updateUserProfile)
  .delete(deleteUser);

router.route("/password").post(changeUserPassword);


router.get("/details", getDashboardDetails);
router.post("/add_social", social_add);
router.patch("/update_social/:id", social_update);
router.delete("/delete_social/:id", social_delete);


router.post("/add_logo", upload.single("file"), add_logo);
router.patch("/update_logo/:id", upload.single("file"), update_logo);
router.delete("/delete_logo/:id", delete_logo);


router.post("/add_link", add_link);
router.patch("/update_link/:id", update_link);
router.delete("/delete_link/:id", delete_link);

const uploadFields = [
  { name: "image_title" },
  { name: "image_description_1" },
  { name: "image_description_2" },
  { name: "image_description_3" },
  { name: "image_description_4" },
];


router.post("/add_data", upload.fields(uploadFields), add_home_setting);
router.get("/view_by_id_home_setting/:id", view_id_home_setting);
router.patch("/update_home_setting/:id",upload.fields(uploadFields), update_home_setting);
router.delete("/delete_home_setting/:id", delete_home_setting);


router.post("/add_address", add_AdminAddress);
router.patch("/update_address/:id", update_AdminAddress);
router.delete("/remove_address/:id", delete_AdminAddress);

//router.post("/add_contact", add_contact);
router.patch("/update_contact/:id", update_contact);
router.delete("/delete_contact/:id", delete_contact);

//router.post("/add_demo", add_demo);
router.post("/update_demo/:id",update_Demo);
router.delete("/delete_demo/:id",delete_Demo);
export default router;

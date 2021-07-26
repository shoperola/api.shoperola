import { Router } from "express";
import { upload } from "../../../util/s3-spaces";
import  {add_home_setting, view_home_setting, view_id_home_setting, update_home_setting, delete_home_setting} from "./home_setting_controller";
const router = Router();
const uploadFields = [
    { name: "image_title" },
    { name: "image_description_1" },
    { name: "image_description_2" },
    { name: "image_description_3" },
    { name: "image_description_4" },
  ];
  

router.post("/add_data", upload.fields(uploadFields), add_home_setting);
router.get("/view_all_home", view_home_setting);
router.get("/view_by_id_home_setting/:id", view_id_home_setting);
router.patch("/update_home_setting/:id",upload.fields(uploadFields), update_home_setting);
router.delete("/delete_home_setting/:id", delete_home_setting);


export default router;

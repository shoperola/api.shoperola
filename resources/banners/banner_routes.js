import { Router } from "express";
import { upload } from "../../util/s3-spaces";
import {
  addbanner,
  viewbanner,
  viewbanner_by_id,
  editbanner,
  deletebanner,
} from "./banner_controller";
const router = Router();

router.post("/addbanner", upload.single("file"), addbanner);
router.get("/viewbanner", viewbanner);
router.get("/view_id/:bannerid", viewbanner_by_id);
router.patch("/edit_banner/:id", upload.any(), editbanner);
router.delete("/delete_banner/:bannerid", deletebanner);

export default router;

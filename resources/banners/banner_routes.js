import { Router } from "express";
import { upload } from "../../util/s3-spaces";
import {
  addbanner,
  viewbanner,
  viewbanner_by_id,
  editbanner,
  deletebanner,
  suspendBanner, makeliveBanner
} from "./banner_controller";
const router = Router();

router.post("/addbanner", upload.single("file"), addbanner);
router.get("/viewbanner", viewbanner);
router.get("/view_id/:bannerid", viewbanner_by_id);
router.patch("/edit_banner/:id", upload.any(), editbanner);
router.delete("/delete_banner/:bannerid", deletebanner);
router.patch("/suspendBanner/:id", suspendBanner);
router.patch("/makelive/:id", makeliveBanner);

export default router;

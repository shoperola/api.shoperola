import { Router } from "express";
import { upload } from "../../util/s3-spaces.js";
import {
  addtvshow,
  edit_banner,
  metadata,
  edit_season,
  edit_video,
  view_tvshow,
  delete_season,
  delete_tvshow,
  delete_episode,
  edit_episode,
  viewall_tvshow,
} from "./tvshow_controller.js";
const router = Router();

router.post("/addtvshow", addtvshow);
router.patch("/edit_banner/:id", upload.array("file"), edit_banner);
router.patch("/metadata/:id", metadata);
router.patch("/edit_season/:id", edit_season);
router.patch("/edit_video/:id", upload.array("file"), edit_video);
router.get("/view_tvshow/:id", view_tvshow);
router.delete("/delete_season/:sid", delete_season);
router.delete("/delete_tvshow/:id", delete_tvshow);
router.delete("/delete_episode/:sid/:eid", delete_episode);
router.patch("/edit_episode/:sid/:eid", upload.array("file"), edit_episode);
router.get("/viewall_Tvshow", viewall_tvshow);

export default router;

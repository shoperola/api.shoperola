import { Router } from "express";
import {
  createLesson,
  getLesson,
  getLessons,
  updateLesson,
  deleteLesson,
  imdb_searchmovie,
  imdb_searchbyid,
  metadata,
  getVideo,
  suspendLesson,
  trending,
  makeliveLesson
} from "./lesson.controllers";
import { upload } from "../../util/s3-spaces";

const router = Router();

const uploadFields = [
  { name: "video" },
  { name: "banner" },
  { name: "thumbnail" }
];

router
  .route("/")
  .get(getLessons)
  .post(upload.single("thumbnail"), createLesson);

router
  .route("/:id")
  .get(getLesson)
  .put(upload.fields(uploadFields), updateLesson)
  .patch(suspendLesson)
  .delete(deleteLesson);

router.post("/search_metadata/:name", imdb_searchmovie);
router.post("/search_metadata_id/:id", imdb_searchbyid);
router.patch("/makelive/:id", makeliveLesson);
router.patch("/metadata/:id", metadata);
router.get("/video/:id", getVideo);

export default router;

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
} from "./lesson.controllers.js";
import { upload } from "../../util/s3-spaces.js";

const router = Router();

const uploadFields = [
  { name: "video" },
  { name: "banner" },
  { name: "thumbnail" },
];

router
  .route("/")
  .get(getLessons)
  .post(upload.fields(uploadFields), createLesson);

router
  .route("/:id")
  .get(getLesson)
  .put(upload.fields(uploadFields), updateLesson)
  .delete(deleteLesson);

router.post("/search_metadata/:name", imdb_searchmovie);
router.post("/search_metadata_id/:id", imdb_searchbyid);
router.patch("/metadata/:id", metadata);
router.get("/video/:id", getVideo);
export default router;

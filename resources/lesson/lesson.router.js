import { Router } from "express";
import {
  createLesson,
  getLesson,
  getLessons,
  updateLesson,
  deleteLesson,
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

export default router;

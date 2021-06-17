import { Router } from "express";
import { createLesson, updateLesson } from "./lesson.controllers.js";
import { upload } from "../../util/s3-spaces.js";

const router = Router();

const uploadFields = [
  { name: "video" },
  { name: "banner" },
  { name: "thumbnail" },
];

router.route("/").post(upload.fields(uploadFields), createLesson);

router.route("/:id").put(upload.fields(uploadFields), updateLesson);

export default router;

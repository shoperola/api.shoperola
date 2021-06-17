import { Router } from "express";
import { createLesson } from "./lesson.controllers.js";

const router = Router();

router.route("/").post(createLesson);

export default router;

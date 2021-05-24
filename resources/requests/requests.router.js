import { Router } from "express";
import { createRequest } from "./requests.controllers.js";
import { upload } from "../../util/s3-spaces.js";

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "video" }, { name: "attach" }]),
  createRequest
);

export default router;

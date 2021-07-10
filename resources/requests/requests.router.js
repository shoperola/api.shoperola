import { Router } from "express";
import { createRequest } from "./requests.controllers";
import { upload } from "../../util/s3-spaces";

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "video" }, { name: "attach" }]),
  createRequest
);

export default router;

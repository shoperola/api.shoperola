import { Router } from "express";
import {getapps,putapps} from "./apps_controller";
import { upload } from "../../util/s3-spaces";
const router = Router();
const uploadFields = [
    { name: "androidapp" },
    { name: "splashscreen" },

  ];
  router.route("/").get(getapps).put(upload.fields(uploadFields),putapps);

export default router;

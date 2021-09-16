import { Router } from "express";
import {getapps,putapps} from "./apps_controller";
import { upload } from "../../util/s3-spaces";
const router = Router();
const uploadFields = [
    { name: "androidapp" },
    { name: "iosapp" },
    { name: "androidtv" },
    { name: "appletv" },
    { name: "fireostv" }
  ];
router.put("/apps",upload.fields(uploadFields),putapps);
router.get("/apps",getapps);

export default router;
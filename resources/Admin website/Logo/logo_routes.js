import { Router } from "express";
import { upload } from "../../../util/s3-spaces";
import {add_logo,update_logo, view_logo, delete_logo} from "./logo_contoller";
const router = Router();

router.post("/add_logo", upload.single("file"), add_logo);
router.patch("/update_logo/:id", upload.single("file"), update_logo);
router.get("/view_logo", view_logo);
router.delete("/delete_logo/:id", delete_logo);

export default router;

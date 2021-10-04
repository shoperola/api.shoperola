import { Router } from "express";
import { upload } from "../../util/s3-spaces";
import {add_logo,view_logo,update_logo,delete_logo} from "./logo_contoller";

const router = Router();
router.route("/").post(upload.single("file"),add_logo).get(view_logo).patch(upload.single("file"),update_logo).delete(delete_logo)
// router.post("/add_logo", upload.single("file"), add_logo);
// router.get("/view_logo", view_logo);
// router.patch("/update_logo", upload.single("file"), update_logo);
// router.delete("/delete_logo", delete_logo);

export default router;

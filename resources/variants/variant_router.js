import {upload} from "../../util/s3-spaces";
import { Router } from "express";
import {add_variant,update_variant,view_variant} from "./variant_controller"
const router= Router();

router.post("/add_variant",upload.array("file") ,add_variant);
router.put("/update_variant/:id",upload.array("file") ,update_variant);
router.get("/view_variant",view_variant);


export default router;

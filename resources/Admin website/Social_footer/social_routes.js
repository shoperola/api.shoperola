import { Router } from "express";
import {social_add, social_update, view_social, social_delete} from "./social_controller";

const router = Router();

router.post("/add_social", social_add);
router.patch("/update_social", social_update);
router.get("/view_social", view_social);
router.delete("/delete_social", social_delete);
export default router;

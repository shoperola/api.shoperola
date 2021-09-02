import { Router} from "express";
import { social_update, view_social} from "./social_controller";
const router = Router();

router.get("/social",view_social);
router.put("/social",social_update);


export default router;
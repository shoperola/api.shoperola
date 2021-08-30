import { Router } from "express";

import { getConfigText,postconfigText,getAllText,deleteText} from "./text.controller";
const router = Router();

router.get("/configtext",getConfigText);
router.post("/configtext",postconfigText);
router.get("/viewalltext",getAllText);
router.delete("/deletetext",deleteText);


export default router;

import { Router } from "express";

import { getConfigText,postconfigText,getAllText,deleteText,updateText} from "./text.controller";
const router = Router();

router.get("/configtext/:id",getConfigText);
router.post("/configtext",postconfigText);
router.get("/viewalltext",getAllText);
router.delete("/deletetext/:id",deleteText);
router.put("/updatetext/:id",updateText);


export default router;

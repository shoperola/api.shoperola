import { Router } from "express";

import { getConfigText,postconfigText,getAllText} from "./text.controller";
const router = Router();

router.get("/configtext",getConfigText);
router.post("/configtext",postconfigText);
router.get("/viewalltext",getAllText);


export default router;

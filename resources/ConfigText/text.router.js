import { Router } from "express";

import { getConfigText,postconfigText} from "./text.controller";
const router = Router();

router.get("/configtext",getConfigText);
router.post("/configtext",postconfigText);


export default router;

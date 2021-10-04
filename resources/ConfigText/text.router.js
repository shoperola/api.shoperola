import { Router } from "express";

import { getConfigText,postconfigText,getAllText,deleteText,updateText} from "./text.controller";
const router = Router();

router.route("/").post(postconfigText).get(getAllText);
router.route("/:id").get(getConfigText).put(updateText).delete(deleteText);


export default router;

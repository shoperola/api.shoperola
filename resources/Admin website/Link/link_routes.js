import { Router } from "express";

import  {add_link, update_link,view_link,delete_link} from "./link_controller";
const router = Router();

router.post("/add_link", add_link);
router.patch("/update_link/:id", update_link);
router.delete("/delete_link/:id", delete_link);
router.get("/view_links", view_link);


export default router;

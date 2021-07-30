import { Router } from "express";
import { add_Categories, view_Categories, view, update_Categories, delete_Categories } from "./Content_category_contoller";

const router = Router();

router.post("/add_categories", add_Categories);
router.get("/view_by_id_categories/:id", view_Categories);
router.get("/view_all_categories", view);
router.patch("/update_categories/:id", update_Categories);
router.delete("/delete_categories/:id", delete_Categories);
export default router;

import { Router } from "express";
import { add_ContentCategories, view_ContentCategories, view, update_ContentCategories, delete_ContentCategories } from "./Content_category_contoller";

const router = Router();

router.post("/add_categories", add_ContentCategories);
router.get("/view_by_id_categories/:id", view_ContentCategories);
router.get("/view_all_categories", view);
router.patch("/update_categories/:id", update_ContentCategories);
router.delete("/delete_categories/:id", delete_ContentCategories);
export default router;

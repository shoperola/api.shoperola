import { Router } from "express";
import {
  add_category,
  view_category,
  view,
  update_category,
  delete_category,
} from "./Category_controller";

const router = Router();

router.route("/").get(view).post(add_category);
router
  .route("/:id")
  .get(view_category)
  .patch(update_category)
  .delete(delete_category);

export default router;

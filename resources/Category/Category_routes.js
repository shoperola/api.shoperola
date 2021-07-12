import { Router } from "express";
import {
    add_category,
    view_category,
    view,
    update_category,
    delete_category
  } from "./Category_controller";

  const router = Router();

  router.post("/add-category", add_category);
  router.get("/view_category/:id", view_category);
  router.get("/view_all", view);
  router.patch("/update_category/:id" , update_category);
  router.delete("/delete_category/:id", delete_category);

  export default router;

  
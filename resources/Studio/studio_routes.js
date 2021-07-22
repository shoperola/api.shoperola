import { Router } from "express";
import {
  add_product,
  delete_product,
  view_list,
  view_listbyid,
} from "./studio_contoller";
const router = Router();

router.post("/add_product_list/:id", add_product);
router.get("/view_product", view_list);
router.get("/view_byid/:id", view_listbyid);
router.delete("/delete_product/:id", delete_product);

export default router;

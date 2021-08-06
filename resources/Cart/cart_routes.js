import { Router } from "express";

import { update_cart, view_cart, remove_product, update_quantity } from "./cart_contoller";
const router = Router();

router.post("/add_product", update_cart);
router.get("/view_cart", view_cart);
router.delete("/remove_product/:id", remove_product);
router.patch("/update_quantity/:pid", update_quantity);

export default router;

import { Router } from "express";

import { update_cart, view_cart, remove_product, update_quantity } from "./cart_contoller";
const router = Router();

router.post("/add_product", update_cart);
router.get("/view_cart", view_cart);
router.delete("/remove_product/:id", remove_product);
router.patch("/update_quantity/:pid", update_quantity);
//router.post('/get_orders_overPrice', get_product_by_price);

export default router;

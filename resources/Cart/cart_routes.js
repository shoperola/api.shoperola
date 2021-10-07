import { Router } from "express";

import { update_cart, view_cart, remove_product, update_quantity } from "./cart_contoller";
const router = Router();

router.route("/").get(view_cart).post(update_cart);
router.route("/:id").delete(remove_product).patch(update_quantity);

//router.post('/get_orders_overPrice', get_product_by_price);

export default router;

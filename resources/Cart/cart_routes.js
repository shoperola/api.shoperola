import { Router } from "express";

import {update_cart,view_cart,remove_product} from "./cart_contoller";
const router = Router();

router.post("/add_product", update_cart);
router.get("/view_cart", view_cart);
router.delete("/remove_product/:id", remove_product);


export default router;
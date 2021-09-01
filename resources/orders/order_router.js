import {Router} from "express";
import {  view_order,update_order} from "../paymentLog/order_controller";
const router = Router();



router.patch("/update_order",update_order);
router.get("/view_order",view_order);

export default router;

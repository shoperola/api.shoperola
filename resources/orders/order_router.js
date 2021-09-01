import {Router} from "express";
import {  show_order, order_by_id,update_address ,update_order} from "../paymentLog/order_controller";
const router = Router();



router.patch("/update_order",update_order);


export default router;

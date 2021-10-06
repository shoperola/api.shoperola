import {Router} from "express";
import { view_order_byid, view_order,update_order} from "../paymentLog/order_controller";
const router = Router();

router.patch("/update_order",update_order);
router.get("/view_order",view_order);
router.get("/view_order/:id",view_order_byid);

export default router;

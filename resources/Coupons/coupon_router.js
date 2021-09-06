import { Router } from "express";

import { postcoupons,getcoupons,getcouponsbyid,updatecoupons,deletecoupons} from "./coupon_controller";
const router = Router();

router.post("/",postcoupons);
router.get("/",getcoupons);
router.get("/:id",getcouponsbyid);
router.put("/:id",updatecoupons);
router.delete("/:id",deletecoupons);



export default router;

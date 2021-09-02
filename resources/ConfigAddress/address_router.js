import { Router } from "express";
import {update_Address,view_Address} from "./address_controller";
const router = Router();

router.put("/update_address", update_Address);
router.get("/view_address", view_Address);

export default router;

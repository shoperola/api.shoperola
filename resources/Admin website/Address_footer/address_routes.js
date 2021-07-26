import { Router } from "express";
import {add_AdminAddress, update_AdminAddress, view_AdminAddress, delete_AdminAddress} from "./address_controller";
const router = Router();

router.post("/add_address", add_AdminAddress);
router.get("/view_address", view_AdminAddress);
router.patch("/update_address/:id", update_AdminAddress);
router.delete("/remove_address/:id", delete_AdminAddress);
export default router;

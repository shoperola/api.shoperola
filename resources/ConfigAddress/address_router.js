import { Router } from "express";
import {add_Address, update_Address,delete_Address,view_Address} from "./address_controller";
const router = Router();

router.post("/add_address", add_Address);
router.patch("/update_address/:id", update_Address);
router.delete("/remove_address/:id", delete_Address);
router.get("/view_address", view_Address);

export default router;

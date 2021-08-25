import { Router } from "express";

import {
  add_address,
  view_address,
  view_address_id,
  delete_address,
  update_address,
  name_filter
} from "../Address/address_controller";
const router = Router();

router.post("/add_address", add_address);
router.get("/view_address", view_address);
router.get("/view_addressID/:id", view_address_id);
router.delete("/remove_address/:id", delete_address);
router.patch("/update_address/:id", update_address);
router.get("/get_shipment", name_filter);

export default router;

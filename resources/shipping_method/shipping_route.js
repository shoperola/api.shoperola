import { Router } from "express";
import { add_shipment, view_shipments, view_shipment, update_shipment, delete_shipment,change_status } from "./shipping_controller";
const router = Router();

router.post("/add_shipment", add_shipment);
router.get("/view_shipments", view_shipments);
router.get("/view_shipment/:id", view_shipment);
router.patch("/update_shipment/:id", update_shipment);
router.delete("/delete_shipment/:id", delete_shipment);
router.get("/change_status/:id", change_status);


export default router;

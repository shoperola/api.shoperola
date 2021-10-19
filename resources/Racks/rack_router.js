import { Router } from "express";
import {
  rackcreate,
  rackupdate,
  rackview,
  rackdelete,
  send_cart,
} from "./rack_controller";


const router = Router();

router.post("/create",rackcreate);
router.put("/update",rackupdate);
router.get("/view",rackview);
router.delete("/delete",rackdelete);
router.post("/",send_cart);



export default router;

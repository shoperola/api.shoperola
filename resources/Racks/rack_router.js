import { Router } from "express";
import { rackcreate,rackupdate,rackview } from "./rack_controller";


const router = Router();

router.post("/create",rackcreate);
router.put("/update",rackupdate);
router.get("/view",rackview);


export default router;

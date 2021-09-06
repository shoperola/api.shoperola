import { Router } from "express";
import {verify_email, send_email,list_verified_emails,delete_verify_list} from "./AWS-SES";
const router = Router();

router.post('/send',send_email);
router.post("/verify", verify_email);
router.get("/get_list", list_verified_emails);
router.delete("/delete_list", delete_verify_list);

export default router;

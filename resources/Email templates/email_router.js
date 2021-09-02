import { Router } from "express";
import {verify_email, send_email,list_verified_emails} from "./AWS-SES";
const router = Router();

router.post('/send',send_email);
router.post("/verify", verify_email);
router.get("/get_list", list_verified_emails);

export default router;

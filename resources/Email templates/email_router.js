import { Router } from "express";
import {
  verify_email,
  send_email,
  list_verified_emails,
  view_email_template,
  view_email_template_byid,
  create_email_template,
  update_email_template,
  delete_email_template,
} from "./AWS-SES";
const router = Router();

router.post("/send", send_email);
router.post("/verify", verify_email);
router.get("/get_list", list_verified_emails);
router.post("/create_email_template", create_email_template);
router.put("/update_email_template/:id", update_email_template);
router.delete("/delete_email_template/:id", delete_email_template);
router.get("/view_email_template", view_email_template);
router.get("/view_email_template/:id", view_email_template_byid);

export default router;

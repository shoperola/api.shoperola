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

// router.post("/send", send_email);
// router.post("/verify", verify_email);
// router.get("/get_list", list_verified_emails);
router.route("/").post(create_email_template).get(view_email_template);
router.route("/:id").put(update_email_template).get(view_email_template_byid).delete(delete_email_template);

export default router;

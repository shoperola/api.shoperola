import { Router } from "express";
import {
  add_contact,
  view_contact,
  view_contact_id,
  update_contact,
  delete_contact,
} from "./contact_us_controller";
const router = Router();

router.route("/").get(view_contact).post(add_contact);

router
  .route("/:id")
  .get(view_contact_id)
  .patch(update_contact)
  .delete(delete_contact);

export default router;

import { Router } from "express";
import {
  add_tax,
  view_tax,
  update_tax,
  delete_tax,
  view_taxs,
} from "./tax_controller";

const router = Router();

router.route("/").get(view_taxs).post(add_tax);
router.route("/:id").get(view_tax).patch(update_tax).delete(delete_tax);
// router.post('/add_tax', add_tax);
// router.get('/view_taxs', view_taxs);
// router.get('/view_tax/:id', view_tax);
// router.patch('/update_tax/:id', update_tax);
// router.delete('/remove_tax/:id', delete_tax);

export default router;

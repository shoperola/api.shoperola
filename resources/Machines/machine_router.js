import { Router } from "express";
import {
  getMachines,
  addMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} from "./machine_controller";
const router = Router();

router.route("/").get(getMachines).post(addMachines);
router
  .route("/:id")
  .get(getMachineById)
  .put(updateMachine)
  .delete(deleteMachine);

export default router;

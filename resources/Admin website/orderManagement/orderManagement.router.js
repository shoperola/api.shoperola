import { Router } from "express";
import {
  getAllOrders,
  getOrderByOrderId,
  updateOrderStatus,
} from "./orderManagment.controller";

const orderManageRouter = Router();

// order management

orderManageRouter.get("/orders", getAllOrders);
orderManageRouter.get("/orders/:order_id", getOrderByOrderId);
orderManageRouter.post("/updateOrderStatus", updateOrderStatus);

export default orderManageRouter;

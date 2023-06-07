import { Router } from "express";
import {
  view_order_byid,
  view_order,
  update_order,
  create_order,
  fetchOrderConfirmProduct,
  updateProductOrderById,
  removeProductOrderById,
  createOrderPayProduct,
  fetchOrderPay,
  fetchOrderPayById,
  paymentCreateOrder,
  checkoutOrder,
} from "../paymentLog/order_controller";
const router = Router();



// create order to table
router.post("/create_order", create_order);
router.get("/get_order", fetchOrderConfirmProduct);
router.post("/update_order", updateProductOrderById);
router.post("/remove_order", removeProductOrderById);

//------------------Create order pay----------------
router.post("/create_order_pay", createOrderPayProduct);
router.get("/get_order_pay", fetchOrderPay);
router.get("/get_order_pay_By_id/:orderId", fetchOrderPayById);

// -----------------Payment|| Checkout-----------------------
router.get("/order/:orderId", checkoutOrder);
router.post("/capture/:paymentId", paymentCreateOrder);

// old uses
router.patch("/update_order", update_order);
router.get("/view_order", view_order);
router.get("/view_order/:id", view_order_byid);

export default router;

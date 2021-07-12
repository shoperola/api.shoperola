import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./Ecommerce_controller";
import { upload } from "../../util/s3-spaces";

const router = Router();

router.route("/").get(getProducts).post(upload.single("image"), addProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(upload.single("image"), updateProduct)
  .delete(deleteProduct);

export default router;

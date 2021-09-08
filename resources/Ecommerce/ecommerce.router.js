import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  count_product
} from "./Ecommerce_controller";
import {add_tax} from "../zero_tax/zero_controller";
import { upload } from "../../util/s3-spaces";
const uploadFields = [
  { name: "image" },
  { name: "image1" },
  { name: "image2" },
  { name: "image3" },
  { name: "image4" },
  { name: "image5" }
];
const router = Router();

router.route("/").get(getProducts).post(upload.fields(uploadFields), addProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(upload.fields(uploadFields), updateProduct)
  .delete(deleteProduct);
router.post('/count_delete_tax/:id', count_product);
router.post('/add_tax', add_tax);
export default router;

import express from "express";
import {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
} from "./franchise.controller";
import Product from "../Product/product.model";
const router = express.Router();

const ProductModel = (req, res, next) => {
  req.model = Product;
  next();
};

// get all orders DELEVERED
router.get("/stockProductOdrer", getAllProduct);
router.post("/stockProductOdrerById", getProductById);

router.post("/products", ProductModel, createProduct);

router.patch("/updateProductById", ProductModel, updateProductById);

// router.get('/products/:id', getProductById);
// router.put('/products/:id', updateProductById)
// router.delete('/products/:id', deleteProductById);
export default router;

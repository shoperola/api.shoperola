import express from "express";
import cron from "node-cron";

import {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
} from "./vending.controller";
import FranchiseProductModel from "../FranchiseProduct/franchise.model";

import { protect } from "../../util/auth";

const router = express.Router();

const ProductModel = (req, res, next) => {
  req.model = FranchiseProductModel;
  next();
};

router.post("/products", ProductModel, createProduct);

router.post("/getAllProduct", getAllProduct);

router.post("/getProductById", getProductById);

router.patch("/updateProductById", ProductModel, updateProductById);



// router.get('/products/:id', getProductById);
// router.put('/products/:id', updateProductById)
// router.delete('/products/:id', deleteProductById);
export default router;

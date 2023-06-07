import express from 'express'
import multer from 'multer'
import { upload } from "../../util/s3-spaces";
import { createProduct, deleteProductById, getProduct, updateProductById, getProductById } from "./product.controller"
const router = express.Router()



router.post('/addProduct', createProduct);
router.get('/products', getProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProductById)
router.delete('/products/:id', deleteProductById);
export default router
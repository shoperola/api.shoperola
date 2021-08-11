import { Router } from "express";
import {add_feautred_product,view_featured_products, view_featured_product,update_featured_product,delete_feature_product,change_status} from "./featured_controller";
import { upload } from "../../util/s3-spaces";

const router = Router();

router.post('/add_feautred_product/:id', upload.single('image'),add_feautred_product);
router.get('/view_featured_products', view_featured_products);
router.get('/view_featured_product/:id', view_featured_product);
router.patch('/update_featured_product/:id', upload.single('image') ,update_featured_product);
router.delete('/delete_feature_product/:id', delete_feature_product);
router.get('/change_status/:id',change_status);


export default router;

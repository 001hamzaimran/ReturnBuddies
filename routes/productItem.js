import express from 'express'
import { upload } from '../middlewares/Multer.js'
import { createProductItems, getProductItems, updateLabel } from '../controllers/ProductItemController.js';


const ProductItemRoutes = express.Router()

ProductItemRoutes.post("/AddProductItem", upload.array("images", 10), createProductItems);
ProductItemRoutes.get("/getProductItems/:userid", getProductItems);
ProductItemRoutes.post("/UpdateLabel", upload.array("images", 10), updateLabel);

export default ProductItemRoutes
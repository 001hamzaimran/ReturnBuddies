import express from 'express'
import { upload } from '../middlewares/Multer.js'
import { createProductItems, getProductItems, uploadLabel,  } from '../controllers/ProductItemController.js';


const ProductItemRoutes = express.Router()

ProductItemRoutes.post("/AddProductItem", upload.array("images", 10), createProductItems);
ProductItemRoutes.get("/getProductItems/:userid", getProductItems);
ProductItemRoutes.post("/uploadLabel", upload.array("label", 10), uploadLabel);

export default ProductItemRoutes
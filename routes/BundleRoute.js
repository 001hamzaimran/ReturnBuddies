import express from 'express';
import { createProductItemsAndReturnBundle, getAllReturnBundles, getReturnBundle } from '../controllers/returnBundleController.js';
import { upload } from '../middlewares/Multer.js';

const bundleRouter = express.Router();

bundleRouter.post('/addbundle',upload.array("files", 10),createProductItemsAndReturnBundle);
bundleRouter.get('/getbundle',getReturnBundle);
bundleRouter.get('/getAllReturnBundles',getAllReturnBundles);

export default bundleRouter

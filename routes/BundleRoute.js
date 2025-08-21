import express from 'express';
import { createProductItemsAndReturnBundle, DeleteBundle, getAllReturnBundles, getAllReturnBundlesAdmin, getReturnBundle } from '../controllers/returnBundleController.js';
import { upload } from '../middlewares/Multer.js';

const bundleRouter = express.Router();

bundleRouter.post('/addbundle', upload.array("files", 10), createProductItemsAndReturnBundle);
bundleRouter.get('/getbundle', getReturnBundle);
bundleRouter.get('/getAllReturnBundles', getAllReturnBundles);
bundleRouter.get('/getAllReturnBundlesAdmin', getAllReturnBundlesAdmin);
bundleRouter.post('/deletebundle', DeleteBundle);

export default bundleRouter

import { Router } from "express";
import { createPickup, getAllPickups, pickupById, PickupbyStatus, pickupCanceled } from "../controllers/pickup.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

const pickupRouter = Router();

pickupRouter.post('/add-pickup', isLogin, createPickup);
pickupRouter.get('/get-pickup', isLogin, getAllPickups);
pickupRouter.get('/get-pickup-status', isLogin, PickupbyStatus);
pickupRouter.get('/get-pickup-by-id/:id', isLogin, pickupById);
pickupRouter.post('/canceled-pickup/:id', isLogin, pickupCanceled);

export default pickupRouter;
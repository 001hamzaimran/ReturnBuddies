import { Router } from "express";
import { addCarrierAndTracking, createPickup, getAllCompletedPickupsCount, getAllPickups, getAllPickupsAdmin, pickupById, PickupbyStatus, pickupcancelled, updatePickupStatus } from "../controllers/pickup.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

const pickupRouter = Router();

pickupRouter.post('/add-pickup', isLogin, createPickup);
pickupRouter.get('/get-pickup', isLogin, getAllPickups);
pickupRouter.get('/get-all-pickup', isLogin, getAllPickupsAdmin);
pickupRouter.get('/get-pickup-status', isLogin, PickupbyStatus);
pickupRouter.get('/get-pickup-by-id/:id', isLogin, pickupById);
pickupRouter.post('/cancelled-pickup/:id', isLogin, pickupcancelled);
pickupRouter.get('/get-pickup-completed', isLogin, getAllCompletedPickupsCount);
pickupRouter.post('/update-pickup/:id', isLogin, updatePickupStatus);
pickupRouter.post('/add-tracking-carrier/:id', isLogin, addCarrierAndTracking);

export default pickupRouter;
import { Router } from "express";
import { createPickup } from "../controllers/pickup.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

const pickupRouter = Router();

pickupRouter.post('/add-pickup', isLogin,createPickup);

export default pickupRouter;
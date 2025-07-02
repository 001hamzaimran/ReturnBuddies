import express from "express";
import { isLogin } from "../middlewares/authMiddleware.js";
import { getBasePrice } from "../controllers/basePrice.Controller.js";

const basepriceRouter = express.Router();

basepriceRouter.get("/get-baseprice", isLogin, getBasePrice);

export default basepriceRouter;
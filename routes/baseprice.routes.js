import express from "express";
import { isLogin } from "../middlewares/authMiddleware.js";
import { getBasePrice,updateBasePrice } from "../controllers/basePrice.Controller.js";

const basepriceRouter = express.Router();

basepriceRouter.get("/get-baseprice", isLogin, getBasePrice);
basepriceRouter.put("/update-baseprice", isLogin, updateBasePrice);

export default basepriceRouter;


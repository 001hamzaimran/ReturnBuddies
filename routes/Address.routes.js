import express from "express";
import { addAddress, addressUpdate, getAllAddresses } from "../controllers/Address.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

export const addressRouter = express.Router();

addressRouter.post("/add-address", isLogin, addAddress);
addressRouter.get("/get-all-address", isLogin, getAllAddresses);
addressRouter.post("/update-address", isLogin, addressUpdate);

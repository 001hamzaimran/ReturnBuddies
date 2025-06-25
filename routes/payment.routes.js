import express from "express";
import { addPaymentCard } from "../controllers/Payment.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

export const PaymentRouter = express.Router();

PaymentRouter.post("/add-Payment-card",isLogin,addPaymentCard)
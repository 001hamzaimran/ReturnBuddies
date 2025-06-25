import express from "express";
import { addPaymentCard, editCard, getUserCards } from "../controllers/Payment.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

export const PaymentRouter = express.Router();

PaymentRouter.post("/add-Payment-card",isLogin,addPaymentCard);
PaymentRouter.post("/edit-Payment-card/:cardId",isLogin,editCard);
PaymentRouter.get("/get-Payment-card",isLogin,getUserCards);

import { Router } from "express";
import { addPromo, deletePromos, getAllPromo, getPromo } from "../controllers/Promo.Controller.js";
import { get } from "mongoose";
import { isAdmin } from "../middlewares/authMiddleware.js";

export const PromoRouter = Router();

PromoRouter.post("/add-Promo", isAdmin, addPromo);
PromoRouter.get("/get-Promo", isAdmin, getPromo);
PromoRouter.get("/get-all-Promo", isAdmin, getAllPromo);
PromoRouter.delete("/delete-Promo/:Id", isAdmin, deletePromos);
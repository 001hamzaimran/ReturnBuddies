import { Router } from "express";
import { addPromo, getPromo } from "../controllers/Promo.Controller.js";
import { get } from "mongoose";

export const PromoRouter = Router();

PromoRouter.post("/add-Promo", addPromo);
PromoRouter.get("/get-Promo", getPromo);
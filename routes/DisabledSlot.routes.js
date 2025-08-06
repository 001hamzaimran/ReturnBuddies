import {Router} from "express";
import { disableSlot, getDisabledSlots } from "../controllers/disabledSlotController.js";

export const disabledSlotRouter = Router();

disabledSlotRouter.post("/disable-slot", disableSlot);
disabledSlotRouter.get("/get-disabled-slots", getDisabledSlots);
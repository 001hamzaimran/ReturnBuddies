import {Router} from "express";
import { disableSlot, getDisabledSlots, getSlotData, updateDisabledSlot } from "../controllers/disabledSlotController.js";

export const disabledSlotRouter = Router();

disabledSlotRouter.post("/disable-slot", disableSlot);
disabledSlotRouter.get("/get-disabled-slots", getDisabledSlots);
disabledSlotRouter.get("/get-slots-data", getSlotData);
disabledSlotRouter.post("/update-disabled-slot", updateDisabledSlot);
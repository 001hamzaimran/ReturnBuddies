import { Router } from "express";
import {
    disableSlot,
    getDisabledSlots,
    getSlotData,
    updateDisabledSlot,
    setSlotCapacity,
    setDayCapacity,
    getPickupsForSlot
} from "../controllers/disabledSlotController.js";

export const disabledSlotRouter = Router();

disabledSlotRouter.post("/disable-slot", disableSlot);
disabledSlotRouter.get("/get-disabled-slots", getDisabledSlots);
disabledSlotRouter.get("/get-slots-data", getSlotData);
disabledSlotRouter.post("/update-disabled-slot", updateDisabledSlot);

// New ones:
disabledSlotRouter.post("/set-slot-capacity", setSlotCapacity);
disabledSlotRouter.post("/set-day-capacity", setDayCapacity);
disabledSlotRouter.get("/get-pickups", getPickupsForSlot);

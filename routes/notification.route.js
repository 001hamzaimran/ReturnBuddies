import {Router} from "express";
import { testNotification } from "../controllers/push.notification.js";

const router = Router();


router.post("/test", testNotification);

export default router;

import { Router } from "express";
import { addNotification, getNotification } from "../controllers/Notification.Controller.js";
import { isLogin } from "../middlewares/authMiddleware.js";

const NotificationRouter = Router();

NotificationRouter.get('/get-notifications', isLogin, getNotification);
NotificationRouter.post('/add-notifications', isLogin, addNotification);

export default NotificationRouter
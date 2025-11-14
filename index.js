import cors from "cors";
import path from "path";
import cron from "node-cron";
import { config } from "dotenv";
import express from "express";
import passport from "passport";
import DbCon from "./utils/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./middlewares/passport/googleStrategy.js";

import router from "./routes/index.js";
import faqRouter from "./routes/FAQ.routes.js";
import bundleRouter from "./routes/BundleRoute.js";
import pickupRouter from "./routes/pickup.routes.js";
import { PromoRouter } from "./routes/Promo.routes.js";
import ProductItemRoutes from "./routes/productItem.js";
import { addressRouter } from "./routes/Address.routes.js";
import { PaymentRouter } from "./routes/payment.routes.js";
import basepriceRouter from "./routes/baseprice.routes.js";
import notificationRoutes from "./routes/notification.route.js";
import NotificationRouter from "./routes/Notification.routes.js";
import { disabledSlotRouter } from "./routes/DisabledSlot.routes.js";
import { getRoutificOrders } from "./controllers/Routific.Controller.js";
import {
  morningOfPickup,
  oneDayBeforePickup,
} from "./controllers/push.notification.js";

config();

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/public", express.static("public"));

app.use(cors());

app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.Db_Url,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const routes = [
  router,
  faqRouter,
  PromoRouter,
  bundleRouter,
  pickupRouter,
  addressRouter,
  PaymentRouter,
  basepriceRouter,
  ProductItemRoutes,
  NotificationRouter,
  disabledSlotRouter,
  notificationRoutes,
];

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const cronJob = async () => {
  cron.schedule(
    "0 8 * * *",
    async () => await getRoutificOrders(759727, getTodayDate()),
    {
      timezone: "America/New_York",
    }
  );
};

const oneDayBeforePickupCronJob = async () => {
  cron.schedule("0 19 * * *", async () => await oneDayBeforePickup(), {
    timezone: "America/New_York",
  });
};

const morningOfPickupCronJob = async () => {
  cron.schedule("0 8 * * *", async () => await morningOfPickup(), {
    timezone: "America/New_York",
  });
};

app.get("/privacy-policy", (_, res) => {
  res.sendFile(path.resolve("public/privacy-policy.html"));
});

app.get("/term-and-condition", (_, res) => {
  res.sendFile(path.resolve("public/term-and-condition.html"));
});
routes.map((route) => app.use("/api", route));

app.get("/", (_, res) => res.send("Hello World"));

cronJob();
morningOfPickupCronJob();
oneDayBeforePickupCronJob();

const startServer = async () => {
  try {
    await DbCon();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1);
  }
};

startServer();

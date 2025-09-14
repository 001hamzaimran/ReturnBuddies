import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import DbCon from './utils/db.js'
import cron from 'node-cron';

import './middlewares/passport/googleStrategy.js'

import router from './routes/index.js'
import bundleRouter from './routes/BundleRoute.js'
import ProductItemRoutes from './routes/productItem.js'
import { addressRouter } from './routes/Address.routes.js'
import { PaymentRouter } from './routes/payment.routes.js'
import basepriceRouter from './routes/baseprice.routes.js'
import pickupRouter from './routes/pickup.routes.js'
import faqRouter from './routes/FAQ.routes.js'
import { PromoRouter } from './routes/Promo.routes.js'
import NotificationRouter from './routes/Notification.routes.js'
import { disabledSlotRouter } from './routes/DisabledSlot.routes.js'
import { getRoutificOrders } from './controllers/Routific.Controller.js'


dotenv.config()

// db connection 


const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use('/public', express.static('public'));

app.use(cors())

// google login setup
app.use(session({
  secret: "some-secret",
  resave: false,
  saveUninitialized: true,

}))
app.use(passport.initialize())
app.use(passport.session())

const routes = [router, bundleRouter, ProductItemRoutes, addressRouter, PaymentRouter, basepriceRouter, pickupRouter, faqRouter, PromoRouter, NotificationRouter, disabledSlotRouter]

function getTodayDate() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

async function cronJob() {
  // Run at minute 0 of every hour → once per hour
  cron.schedule("0 * * * *", async () => {
    const workspaceId = 759727;
    const date = getTodayDate(); // today's date in YYYY-MM-DD

    console.log(`Running cron job at ${new Date().toLocaleTimeString()} for date: ${date}`);

    try {
      const orders = await getRoutificOrders(workspaceId, date);
      console.log("Delivered orders:", orders);
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
}

routes.map(route => {
  app.use('/api', route)
})
// app.use('/api', router)
// app.use('/api', bundleRouter)
// app.use('/api', ProductItemRoutes)
// app.use('/api', addressRouter)
// app.use('/api', PaymentRouter)
// app.use('/api', PaymentRouter)

app.get('/', (req, res) => {
  res.send("Hello World")
})


cronJob();



const startServer = async () => {
  try {
    await DbCon(); // Ensure DB is connected before server starts
    app.listen(PORT, () => {
      console.log(`✅ Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to DB:', error.message);
    process.exit(1); // Exit the process if DB fails
  }
};

startServer();







import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import DbCon from './utils/db.js'

import './middlewares/passport/googleStrategy.js'

import router from './routes/index.js'
import bundleRouter from './routes/BundleRoute.js'
import ProductItemRoutes from './routes/productItem.js'
import { addressRouter } from './routes/Address.routes.js'
import { PaymentRouter } from './routes/payment.routes.js'


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

app.use('/api', router)
app.use('/api', bundleRouter)
app.use('/api', ProductItemRoutes)
app.use('/api', addressRouter)
app.use('/api', PaymentRouter)

app.get('/', (req, res) => {
  res.send("Hello World")
})

//time delay api

app.get('/time-dealy', async (req, res) => {
  try {
    // Delay for 5 seconds
    setTimeout(() => {
      const data = {
        name: "Farzam choutia",
        age: 20,
        gender: "male"
      };
      return res.status(200).json({
        message: "success",
        status: 200,
        success: true,
        data
      });
    }, 5000); // 5000 milliseconds = 5 seconds
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      success: false
    });
  }
});



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







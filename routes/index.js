import express from 'express'

import AuthRoutes from './User.js'
// import ItemsRoutes from './Items.js'
import AdminRoutes from './Admin/Admin.js'
import notificationRoutes from "./notification.route.js";

const router=express.Router()

router.use('/user',AuthRoutes)
// router.use('/items', ItemsRoutes)
router.use('/admin', AdminRoutes)
router.use('/notifications', notificationRoutes)

export default router
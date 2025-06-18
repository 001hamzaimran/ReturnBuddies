import express from 'express'

import AuthRoutes from './User.js'
// import ItemsRoutes from './Items.js'
import AdminRoutes from './Admin/Admin.js'

const router=express.Router()

router.use('/user',AuthRoutes)
// router.use('/items', ItemsRoutes)
router.use('/admin', AdminRoutes)

export default router
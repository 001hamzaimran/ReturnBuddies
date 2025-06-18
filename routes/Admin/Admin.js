import express from 'express'
import {  getUsers } from '../../controllers/Admin.js'
import { isAdmin } from '../../middlewares/authMiddleware.js'


const AdminRoutes=express.Router()

AdminRoutes.get('/dashboard',isAdmin,getUsers)

export default AdminRoutes
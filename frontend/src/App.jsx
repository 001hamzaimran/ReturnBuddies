import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserLayouts from './layouts/User/UserLayouts'
import Home from './pages/users/Home'
import Login from './pages/users/Login'
import Register from './pages/users/Register'
import AdminLayouts from './layouts/Admin/AdminLayouts'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import AddItem from './pages/users/AddItem'
import MyPickups from './pages/users/MyPickups'
import PickupManagement from './pages/admin/PickupManagement'
import WarehouseManagement from './pages/admin/WarehouseManagement'
import PaymentManagement from './pages/admin/PaymentManagement'
import ErrorPage from './pages/ErrorPage'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'
import ForgotPassword from './pages/users/ForgotPassword'
import PromoCode from './pages/admin/PromoCode'

export default function App() {
  return (
    <>

      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            {/* ✅ Redirect root to /admin/dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path='/admin/dashboard' element={<AdminLayouts />}>
              <Route index element={<Dashboard />} />
              <Route path='users' element={<Users />} />
              <Route path='Pickup-Management' element={<PickupManagement />} />
              <Route path='Warehouse-Management' element={<WarehouseManagement />} />
              <Route path='Payment-Management' element={<PaymentManagement />} />
              <Route path='Promo-code' element={<PromoCode />} />
            </Route>

            <Route path='/admin/dashboard/login' element={<Login />} />
            <Route path='/admin/dashboard/forgot-password' element={<ForgotPassword />} />
            <Route path='/register' element={<Register />} />

            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>


    </>
  )
}

import React, { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { HiOutlineBookmark } from 'react-icons/hi2';
import Logo from '../../assets/Images/Logo.png'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import BaseUrl from '../../service/BaseUrl';
import useAuth from '../../hook/useAuth';
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [value, setValue] = useState({
    email: "admin@gmail.com",
    password: "12345678"
  })
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BaseUrl}/api/user/login`, value)
      const data = res.data
      if (res.status == 200 && data.user.role == 'admin') {
        login({ user: data.user, token: data.token })
        navigate('/admin/dashboard')

        toast.success(data.message)
      } else {
        toast.error('Invalid credential')
      }


    } catch (error) {
      console.log('erro', error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error or server is unreachable.");
      }
    }

    // navigate('/admin/dashboard')

  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-10">

        <div className="flex items-center justify-between mb-6">
          <img src={Logo} alt="" width={33} height={33} />
        </div>

        <h2 className="text-2xl font-bold text-black mb-8 text-center sm:text-left">
          Login
        </h2>

        <div className="mb-5">
          <label className="block text-sm text-black mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={value.email}
            onChange={(e) => setValue({ ...value, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] placeholder:text-gray-400 text-black focus:outline-none"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm text-black mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={value.password}
              onChange={(e) => setValue({ ...value, password: e.target.value })}
              className="w-full px-4 py-3 pr-10 rounded-xl bg-[#f4f4f4] placeholder:text-gray-400 text-black focus:outline-none"
            />
            <span onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* 🔗 Forgot Password Link */}
        <div className="mb-6 text-right">
          <Link to="/admin/dashboard/forgot-password" className="text-sm text-[#b152ee] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          className="w-full bg-gradient-to-r cursor-pointer from-[#b152ee] to-[#d28bff] text-white font-bold py-3 rounded-full hover:opacity-90 transition mb-4"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  );
}

import React from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign up</h2>
    <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter  full name"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#b152ee] transition"
          />
        </div>
        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#b152ee] transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#b152ee] transition"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
              👁️
            </span>
          </div>
        </div>

        {/* Or Divider */}
        <div className="text-center text-gray-500 my-6 relative">
          <hr className="border-t absolute top-3 w-full" />
          <span className="bg-white relative px-4 text-sm">or</span>
        </div>

        {/* Social Buttons */}
        <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl mb-3 hover:bg-gray-100 transition">
          <FaGoogle className="mr-2" /> Login with Google
        </button>
        <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl mb-6 hover:bg-gray-100 transition">
          <FaApple className="mr-2" /> Login with Apple
        </button>

        {/* Login Button */}
        <button className="w-full bg-[#b152ee] hover:bg-[#a246db] text-white font-semibold py-3 rounded-xl transition">
          Login
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <span className="text-[#b152ee] hover:underline font-semibold cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

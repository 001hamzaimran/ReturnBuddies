import React, { useState } from 'react';
import Logo from '../../assets/Images/Logo.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import BaseUrl from '../../service/BaseUrl';
import { set } from 'mongoose';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState('find'); // find → otp → reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loding,setLoding]=useState(false)

  const handleFindAccount = async () => {
    try {
        setLoding(true)
      const res = await axios.post(`${BaseUrl}/api/user/forgot-password`, { email });
      const data=res.data
      if (res.status === 200) {
        toast.success(data.message);
        setStep('otp');
        setToken(res.data.token); // If your backend sends a temp token
      }
      setLoding(false)
    } catch (error) {
        setLoding(false)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error or server is unreachable.");
      }
      console.log(error);
      toast.error(
        error?.response?.data?.message || 'Failed to send OTP. Try again.'
      );
    }
    
  };

  const handleVerifyOtp = async () => {
    try {
        setLoding(true)
      const res = await axios.post(`${BaseUrl}/api/user/forgot-verfication`, {
        email,
        otp,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setStep('reset');
      }
      setLoding(false)
    } catch (error) {
      setLoding(false)

      console.log(error);
      toast.error(error?.response?.data?.message || 'Invalid OTP');
    }
    
  };

  const handleResetPassword = async () => {
    try {
        setLoding(true)
      const res = await axios.post(`${BaseUrl}/api/user/update-password`, {
        email,
        password,
      });
        
      if (res.status === 200) {
        toast.success('Password updated successfully!');
        setStep('done');
      }
      setLoding(false)
    } catch (error) {
      setLoding(false)

        console.log('error',error)
      toast.error(error?.response?.data?.errors[0].message || 'Error updating password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-10 relative">
        <div className="flex items-center justify-between mb-6">
          <img src={Logo} alt="Logo" width={33} height={33} />
        </div>

        <h2 className="text-2xl font-bold text-black mb-8 text-center sm:text-left">
          Forgot Password
        </h2>

        {/* Step 1: Find Account */}
        {step === 'find' && (
          <>
            <label className="block text-sm text-black mb-1">Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] placeholder:text-gray-400 text-black focus:outline-none mb-6"
            />
            <button
              onClick={handleFindAccount}
              className="w-full bg-gradient-to-r cursor-pointer from-[#b152ee] to-[#d28bff] text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              {loding ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {/* Step 2: OTP Modal */}
        {step === 'otp' && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center p-6 rounded-3xl z-10">
            <h3 className="text-xl font-bold mb-4 text-center text-black">
              Enter OTP
            </h3>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] mb-4 placeholder:text-gray-400 text-black focus:outline-none"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r cursor-pointer from-[#b152ee] to-[#d28bff] text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
                {loding ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {/* Step 3: Reset Password Modal */}
        {step === 'reset' && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center p-6 rounded-3xl z-20">
            <h3 className="text-xl font-bold mb-4 text-center text-black">
              Reset Password
            </h3>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#f4f4f4] mb-4 placeholder:text-gray-400 text-black focus:outline-none"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r cursor-pointer from-[#b152ee] to-[#d28bff] text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              {loding ? 'Updating...' : 'Set New Password'}
            </button>
          </div>
        )}

        {/* Step 4: Success message */}
      {step === 'done' && (
  <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center p-6 rounded-3xl z-30">
    <h3 className="text-xl font-bold mb-4 text-center text-green-600">
      ✅ Password reset successful!
    </h3>
    <p className="text-center text-gray-600 mb-6">
      You can now return to login and use your new password.
    </p>
    <Link  to={'/admin/dashboard/login'}>
    <button
    //   onClick={() => {
    //     window.location.href = ''; // or use React Router's navigate
    //   }}
      className="w-full bg-gradient-to-r  cursor-pointer from-[#b152ee] to-[#d28bff] text-white font-bold py-3 rounded-full hover:opacity-90 transition"
    >
      Please Login
    </button></Link>
    
  </div>
)}

      </div>
    </div>
  );
}

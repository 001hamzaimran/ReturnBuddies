import { useNavigate } from 'react-router-dom';
import React from "react";
import { FiCalendar } from "react-icons/fi"; // Calendar icon
import { IoMdAdd } from "react-icons/io";   // Plus icon

export default function MyPickups() {
    const navigate=useNavigate();
const handleNavigate=()=>{
  navigate("/Additem")
}
  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-10 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-semibold">My Pickups</div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div className="w-4 h-4 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Active Pickups */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Active Pickups</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <PickupCard key={`active-${i}`} />
          ))}
        </div>
      </div>

      {/* Past Pickups */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Past Pickups</h2>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <PickupCard key={`past-${i}`} />
          ))}
        </div>
      </div>

      {/* Floating Plus Button */}
      <button onClick={handleNavigate} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white rounded-full p-5 shadow-xl hover:bg-purple-600 transition-all">
        <IoMdAdd className="text-3xl" />
      </button>
    </div>
  );
}

function PickupCard() {
  const Image='https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  return (
    <div className="bg-white rounded-xl shadow-md flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <img
          src={Image}
          alt="Shoe"
          className="rounded-lg w-12 h-12 object-cover"
        />
        <div>
          <div className="font-medium text-sm">Soda</div>
          <div className="text-xs text-gray-500">Needs info</div>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-700">
        <FiCalendar className="mr-1 text-purple-500" />
        23/7/2024
      </div>
    </div>
  );
}
